import {db} from "@/src/lib/db/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const id = url.searchParams.get("itemtypeId")

        const objects = await db.typeAttribute.findMany({
            where: {
                itemtypeId: Number(id)
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
        const { name, itemtypeId } = body


        const object = await db.typeAttribute.create({
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