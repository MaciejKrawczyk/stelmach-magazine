import {db} from "@/src/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.shelfCategory.findMany({
            include: {
                shelf: true
            }
        })

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}


export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, color, notes } = body

        const objectExists = await db.shelfCategory.findFirst({
            where: {
                name: name
            }
        })

        if (objectExists) {
            return new Response('shelf-shelf-category already exists', { status: 409 })
        }

        const object = await db.shelfCategory.create({
            data: {
                name: name,
                color: color,
                notes: notes,
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }
}