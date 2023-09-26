import { z } from 'zod'

export const OrderSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    placeId: z.number().refine(value => value === 18, {
        message: "Value must always be the id of order Place"
    }),
    shelfId: z.number().refine(value => value === -1, {
        message: "Value must always be -1, because it is not in magazine"
    }),
    shelfType: z.union([
        z.literal('small'),
        z.literal('big')
    ]),
    itemTypeId: z.number(),
    companyId: z.number(),
    isDeleted: z.boolean().refine(value => value === false, {
        message: "Value must always be false"
    }),
    isOrder: z.boolean().refine(value => value === true, {
        message: "Value must always be true"
    }),
    orderCategoryId: z.number(),
    parcelCategoryId: z.number(),
    quantity: z.number()
})

export type Order = z.infer<typeof OrderSchema>