import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.status.findMany()

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}


export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, description } = body


        const object = await db.status.create({
            data: {
                name: name,
                description: description
            }
        })

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }



}