import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.shelf.findMany({
            include: {
                category: true,
                item: true
            }
        })

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}