import {db} from "@/lib/db/db";

export async function GET(req: Request) {
    try {

        const objects = await db.itemType.findMany({})

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}


export async function POST(req: Request) {

    try {

        const body = await req.json()
        console.log(body)

        const objectExists = await db.itemType.findFirst({
            where: {
                name: body.name
            }
        })

        if (objectExists) {
            return new Response('object already exists', { status: 409 })
        }

        let attributes = []
        for (let i=0; i<body.list.length; i++) {
            const typeAttribute: { name: string } = { name: "<empty>" }
            typeAttribute.name = body.list[i]
            attributes.push(typeAttribute)
        }

        const object = await db.itemType.create({
            data: {
                name: body.name,
                typeAttribute: {
                    createMany: {
                        data: attributes
                    }
                }
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
        return new Response('An error occurred', { status: 500 })
    }
}
