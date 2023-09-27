import { z } from 'zod'
import {formatCommasToDots} from "@/utils/formatCommaToDots";


export const CompanySchema = z.object({
    id: z.number().optional(),
    name: z.string()
        .min(1, "Pole nie może być puste")
        .transform(formatCommasToDots),
    notes: z.string()
        .min(1, "Pole nie może być puste")
        .transform(formatCommasToDots)
})

export type Company = z.infer<typeof CompanySchema>