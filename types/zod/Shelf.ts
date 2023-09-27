import { z } from 'zod'
import { ItemSchema } from "@/types/zod/Item";

// Use a forward reference for shelfSchema using z.lazy
const LazyShelfSchema = z.lazy(() => shelfSchema);

const ShelfCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Pole nie może być puste"),
    color: z.string().length(7).regex(/^#/),
    notes: z.string().min(1, "Pole nie może być puste"),
    shelf: z.array(LazyShelfSchema).optional()
});

const shelfSchema = z.object({
    id: z.number(),
    name: z.number().min(1, "Pole nie może być puste"),
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

export {ShelfCategorySchema, shelfSchema};    export type { ShelfCategory, Shelf };

