import { z } from "zod";

const addWatchEmail = z.object({
    body: z.object({
        email: z.string().email(),
        userId: z.string()
    })
})
const getAllWatchEmails = z.object({
    body: z.object({
        userId: z.string()
    })
})
export default {
    addWatchEmail,
    getAllWatchEmails
}