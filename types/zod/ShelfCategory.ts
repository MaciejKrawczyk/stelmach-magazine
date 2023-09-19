import { z } from 'zod'
import {shelfSchema} from "@/types/zod/Shelf";

export const ShelfCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    color: z.string().length(7).regex(/^#/),
    notes: z.string(),
    shelf: z.array(shelfSchema).optional()
})

export type ShelfCategory = z.infer<typeof ShelfCategorySchema>
