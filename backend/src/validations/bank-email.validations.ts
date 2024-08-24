import { z } from "zod";

const addBankEmail = z.object({
    body: z.object({
        email: z.string().email(),
        userId: z.string()
    })
})

export default {
    addBankEmail
}