import { z } from 'zod'
import {ItemSchema} from "@/types/zod/Item";
import {ShelfCategorySchema} from "@/types/zod/ShelfCategory";

export const shelfSchema = z.object({
    id: z.number(),
    name: z.number(),
    size: z.union([
        z.literal('big'),
        z.literal('small')
    ]),
    categoryId: z.number(),
    item: z.array(ItemSchema).optional(),
    shelfCategory: ShelfCategorySchema.optional()
})

export type Shelf = z.infer<typeof shelfSchema>