import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.category.findMany({
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

        const objectExists = await db.category.findFirst({
            where: {
                name,
                color
            }
        })

        if (objectExists) {
            return new Response('category already exists', { status: 409 })
        }

        const object = await db.category.create({
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