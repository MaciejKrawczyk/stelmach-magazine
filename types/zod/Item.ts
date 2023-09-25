import { z } from 'zod'

export const ItemSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    placeId: z.number(),
    shelfId: z.number().nullable(),
    shelfType: z.union([
        z.literal('small'),
        z.literal('big')
    ]),
    // itemTypeId: z.number(),
    itemType: z.string(),
    companyId: z.number(),
    isDeleted: z.boolean(),
    isOrder: z.boolean(),
    orderCategoryId: z.number().nullable(),
    parcelCategoryId: z.number().nullable(),
})

export type Item = z.infer<typeof ItemSchema>