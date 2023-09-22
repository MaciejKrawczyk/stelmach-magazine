import { z } from 'zod'

export const OrderCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    color: z.string().length(7).regex(/^#/),
})

export type OrderCategory = z.infer<typeof OrderCategorySchema>