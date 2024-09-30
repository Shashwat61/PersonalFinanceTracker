import { z } from "zod";

const oAuthCallbackValidation = z.object({
    query: z.object({
        error: z.string().optional(),
        code: z.string().optional()
    })
})

export default {
    oAuthCallbackValidation
}