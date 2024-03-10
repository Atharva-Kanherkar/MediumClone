import { Hono } from 'hono'
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'process';


dotenv.config();


const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())

const app = new Hono()

app.post('/api/v1/user/signup', async (c) => {
  const body = await c.req.json();
  try{
    const user = await prisma.user.create({
      data:{
        email : body.email,
        password : body.password,
      }
    })
    return c.text('jwt here');    
  }
  catch(e) {
		return c.status(403);
	}

})


app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Hono!')
})


app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})


app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})


app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})
 

export default app;
