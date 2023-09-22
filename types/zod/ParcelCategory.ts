import { z } from 'zod'

export const ParcelCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    color: z.string().length(7).regex(/^#/),
    notes: z.string().min(1),
    companyId: z.number()
})

export type ParcelCategory = z.infer<typeof ParcelCategorySchema>