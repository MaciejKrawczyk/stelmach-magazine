import {db} from "@/lib/db/db";
import axios from "axios";


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

        const objectExists = await db.itemType.findFirst({
            where: {
                name: body.name
            }
        })

        if (objectExists) {
            return new Response('object already exists', { status: 409 })
        }

        const object = await db.itemType.create({
            data: {
                name: body.name
            }
        })
        let attributes = []

        // ----- item-type is created
        const itemTypeId = object.id

        for (let i=1;i<body.list.length;i++) {

            const attributeName = body.list[i].value

            const data = await db.typeattribute.create({
                data: {
                    name: attributeName,
                    itemtypeId: Number(itemTypeId)
                }
            })

            attributes.push(data)
        }

        const finishedObject = {
            itemtypeName: object.name,
            attributes: attributes
        }

        return new Response(JSON.stringify(finishedObject))

    } catch (error) {
        console.error(error)
    }
}