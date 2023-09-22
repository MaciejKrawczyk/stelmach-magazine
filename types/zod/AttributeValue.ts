import { z } from 'zod'

export const AttributeValueSchema = z.object({
    id: z.number(),
    value: z.string().min(1),
    itemId: z.number(),
    typeAttributeId: z.number()
})

export type AttributeValue = z.infer<typeof AttributeValueSchema>