import { z } from 'zod'

export const StatusSchema = z.object({
    id: z.number().optional(),
    itemId: z.number().optional(),
    name: z.string(),
    description: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type Status = z.infer<typeof StatusSchema>