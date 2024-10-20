import { z } from "zod";

const createUserBank = z.object({
    body: z.object({
        bankId: z.string(),
        userId: z.string(),
        // length should be 4
        accountNumber: z.string().min(4).max(4),
    })
})

export default {
    createUserBank
}