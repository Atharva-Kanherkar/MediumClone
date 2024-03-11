import z from "zod";

export const signUpInput = z.object({
    username : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})


export type signUpInput = z.infer<typeof signUpInput>

export const signInInput = z.object({
    username : z.string().email(),
    password : z.string().min(6)
})

export type signInInput = z.infer<typeof signInInput>


export const createBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string(),

})

export type createBlogInput = z.infer<typeof createBlogInput>
