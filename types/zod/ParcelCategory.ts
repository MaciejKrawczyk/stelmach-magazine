import { z } from 'zod'

export const ParcelCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    color: z.string().length(7).regex(/^#/),
    notes: z.string(),
    companyId: z.number()
})

export type ParcelCategory = z.infer<typeof ParcelCategorySchema>