import { z } from 'zod'

export const TypeAttributeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    itemTypeId: z.number().optional()
})

export type TypeAttribute = z.infer<typeof TypeAttributeSchema>