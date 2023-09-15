import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {
        const objects = await db.orderCategory.findMany({
        })

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}

export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, color, description } = body

        const objectExists = await db.orderCategory.findFirst({
            where: {
                name,
                color
            }
        })

        if (objectExists) {
            return new Response('category already exists', { status: 409 })
        }

        const object = await db.orderCategory.create({
            data: {
                name: name,
                color: color,
                description: description,
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }



}