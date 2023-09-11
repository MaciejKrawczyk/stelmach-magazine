import {db} from "@/lib/db/db";

export const createStatus = async (itemId: string, nameOfStatus: string, descriptionOfStatus: string) => {
    const status = await db.status.create({
        data: {
            itemId: Number(itemId),
            name: nameOfStatus,
            description: descriptionOfStatus
        }
    })
    return status
}