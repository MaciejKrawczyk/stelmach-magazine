import { z } from 'zod'
import { ItemSchema } from "@/types/zod/Item";

// Use a forward reference for shelfSchema using z.lazy
const LazyShelfSchema = z.lazy(() => shelfSchema);

const ShelfCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    color: z.string().length(7).regex(/^#/),
    notes: z.string(),
    shelf: z.array(LazyShelfSchema).optional()
});

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

type Shelf = z.infer<typeof shelfSchema>;
type ShelfCategory = z.infer<typeof ShelfCategorySchema>;

export { ShelfCategorySchema, ShelfCategory, Shelf };
