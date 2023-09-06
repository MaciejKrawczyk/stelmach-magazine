import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.attributeValue.findMany()

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}


export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { value, itemId, typeattributeId } = body

        const object = await db.attributeValue.create({
            data: {
                value: value,
                itemId: itemId,
                typeattributeId: typeattributeId
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }



}