import { z } from 'zod'

export const OrderSchema = z.object({
    // id: z.number().optional().refine(value => value > 0, {
    //     message: "ID should be a positive number"
    // }), // TODO TO JEST PROBLEM
    // name: z.string().min(1, "Pole jest wymagane"), // ok
    description: z.string().min(1, "Pole jest wymagane"), // ok
    placeId: z.number().refine(value => value > 0, {
        message: "Place ID should be a positive number"
    }), //ok
    // shelfId: z.number().nullable().optional().refine(value => value > 0 || value === null, {
    //     message: "Shelf ID should be a positive number or null"
    // }),  // TODO TO JEST PROBLEM
    // shelfSize: z.string(), // ok
    itemTypeId: z.coerce.number(),
    companyId: z.number().refine(value => value > 0, {
        message: "Company ID should be a positive number"
    }), // ok
    isDeleted: z.boolean().default(false).refine(value => typeof value === 'boolean', {
        message: "IsDeleted should be a boolean value"
    }),
    isOrder: z.boolean().default(true).refine(value => typeof value === 'boolean', {
        message: "IsOrder should be a boolean value"
    }),
    // orderCategoryId: z.number().nullable().optional().refine(value => value > 0 || value === null, {
    //     message: "Order Category ID should be a positive number or null"
    // }), // TODO TO JEST PROBLEM
    // parcelCategoryId: z.number().nullable().optional().refine(value => value > 0 || value === null, {
    //     message: "Parcel Category ID should be a positive number or null"
    // }), // TODO TO JEST PROBLEM
    // shelfCategoryId: z.coerce.number(),
    // attributes: z.object({}).optional()
    attributes: z.record(z.union([z.string(), z.number()])),
    // shelfId: z.number().nullable().optional()
})

export type Order = z.infer<typeof OrderSchema>
