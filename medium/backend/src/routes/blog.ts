import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify } from 'hono/jwt';
import {createBlogInput} from "atharrva15common";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
    Variables : {
      userId : string,
    }
}>();

bookRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }
    const token = jwt.split(' ')[1];
    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload) {
            c.status(401);
            return c.json({ error: "Unauthorized" });
        }
        c.set('userId', payload.id);
        await next();
    } catch (error) {
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});

bookRouter.post('/', async (c) => {
    try {
        const userId = c.get('userId');
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const body = await c.req.json();
        const success = createBlogInput.safeParse(body);
        if (!success.success) {
            return c.json({ error: success.error.issues });
        }
        const post = await prisma.post.create({
            data : {
                title : body.title,
                content : body.content,
                authorId: userId
            }
        })
        return c.json({
            id: post.id
        });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});
  
bookRouter.put('/api/v1/blog', async (c) => {
    try {
         //logic not implemented yet for updating the blog 
    } catch (error) {
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});

bookRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const posts = await prisma.post.findMany();
        return c.json({ posts });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});
  
bookRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const blog = await prisma.post.findFirst({
            where: {
                id: (id)
            }
        });
        if (!blog) {
            c.status(404);
            return c.json({ error: "Blog not found" });
        }
        return c.json({ blog });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});

export default bookRouter;
