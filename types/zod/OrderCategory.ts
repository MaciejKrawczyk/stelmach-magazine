import { z } from 'zod'
import {formatCommasToDots} from "@/utils/formatCommaToDots";

export const OrderCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Pole nie może być puste").transform(formatCommasToDots),
    description: z.string().min(1, "Pole nie moze byc puste").transform(formatCommasToDots),
    color: z.string().length(7).regex(/^#/),
})

export type OrderCategory = z.infer<typeof OrderCategorySchema>