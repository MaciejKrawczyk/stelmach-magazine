import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {
        const objects = await db.parcelCategory.findMany({
            include: {
                company: true
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
        const { name, color, description, companyId } = body

        const objectExists = await db.parcelCategory.findFirst({
            where: {
                name,
                color
            }
        })

        if (objectExists) {
            return new Response('shelf-category already exists', { status: 409 })
        }

        const object = await db.parcelCategory.create({
            data: {
                name: name,
                color: color,
                description: description,
                company: {
                    connect: {
                        id: Number(companyId)
                    }
                }
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }



}