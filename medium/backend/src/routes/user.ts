
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import {signInInput, signUpInput} from 'atharrva15common'


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();



userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
   
    const body = await c.req.json();

const success = signUpInput.safeParse(body);
if (!success.success) {
    return c.json({ error: success.error.issues });
}
    console.log(body);
    try{
      const user = await prisma.user.create({
        data:{
          email : body.email,
          password : body.password,
        }
      })
      const jwt = await sign( { id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
    }
    catch(e) {
          return c.status(403);
      }
  
  })
   
  userRouter.post('/signin', async (c) => {
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
  
      const body = await c.req.json();
      const success = signInInput.safeParse(body);
if (!success.success) {
    return c.json({ error: success.error.issues });
}
      const user = await prisma.user.findUnique({
          where: {
              email: body.email
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
  })
  
  