import { z } from 'zod'

export const CompanySchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    notes: z.string()
})

export type Company = z.infer<typeof CompanySchema>