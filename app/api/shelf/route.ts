import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {
        const objects = await db.shelf.findMany({
            include: {
                shelfCategory: true,
                item: {
                    include: {
                        attributeValue: {
                            include: {
                                typeAttribute: true
                            }
                        },
                        itemType: true
                    }
                }
            }
        })
        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}