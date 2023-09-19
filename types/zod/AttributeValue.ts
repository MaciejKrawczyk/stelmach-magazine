import { z } from 'zod'

export const AttributeValueSchema = z.object({
    id: z.number(),
    value: z.string(),
    itemId: z.number(),
    typeAttributeId: z.number()
})

export type AttributeValue = z.infer<typeof AttributeValueSchema>