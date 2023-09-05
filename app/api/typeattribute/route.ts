import {db} from "@/lib/db";


export async function GET(req: Request) {
    try {

        const objects = await db.typettribute.findMany()

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}


export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, itemtypeId } = body


        const object = await db.typettribute.create({
            data: {
                name: name,
                itemtypeId: itemtypeId
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }



}