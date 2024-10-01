import { z } from "zod";

const getTransactions = z.object({
    query: z.object({
        from: z.string(),
        after: z.string(),
        before: z.string()
    })
})

const getTransactionsVersionOne = z.object({
    query: z.object({
        bankId: z.string(),
        after: z.string(),
        before: z.string(),
        from: z.string()
    })
})

const saveTransactions = z.object({
    // transactions: z.array<>({
    //     messageId: z.string(),
    //     amount: z.number(),
    //     transacted_at: z.string(),
    //     desc: z.string(),
    //     type: z.string()
    // })
})
export default {
    getTransactions,
    saveTransactions,
    getTransactionsVersionOne
}