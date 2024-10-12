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
        after: z.string(),
        before: z.string(),
        from: z.string(),
        trackedId: z.string().optional(),
        limit: z.string().refine(
            (val: string) => {
                if (Number(val) > 100) {
                    throw new Error('Limit should be less than 100')
                }
                else if(Number(val) < 10){
                    throw new Error('Limit should be greater than 10')
                }
                return true
            },
        )
    }),
    params: z.object({
        id: z.string()
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