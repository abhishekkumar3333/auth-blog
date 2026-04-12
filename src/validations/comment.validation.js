import z from "zod";

export const addCommentValidation = z.object({
    content: z.string().min(1, "Comment is required"),
    blog: z.string().min(1, "Blog is required"),
    user: z.string().min(1, "User is required")
})

