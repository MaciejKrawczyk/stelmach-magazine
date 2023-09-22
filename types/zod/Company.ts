import { z } from 'zod'

export const CompanySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    notes: z.string().min(1)
})

export type Company = z.infer<typeof CompanySchema>