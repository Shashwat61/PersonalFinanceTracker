import { z } from "zod";

const getTransactions = z.object({
    query: z.object({
        from: z.string(),
        after: z.string(),
        before: z.string()
    })
})

export default {
    getTransactions
}