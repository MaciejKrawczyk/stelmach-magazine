import {db} from "@/lib/db/db";
import {createStatus} from "@/lib/db/createStatus";


export async function GET(req: Request) {
    try {

        const objects = await db.item.findMany({
            include: {
                company: true,
                itemType: true,
                status: true
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

        const {companyId, description, itemType, name, placeId, shelfType, typeAttributes } = body

        const objectExists = await db.item.findFirst({
            where: {
                name: name
            }
        })

        if (objectExists) {
            return new Response('object already exists', { status: 409 })
        }

        const object = await db.item.create({
            data: {
                name: name,
                description: description,
                itemType: {
                    connect: {
                        id: itemType
                    }
                },
                placeId: Number(placeId),
                shelfType: shelfType,
                company: {
                    connect: {
                        id: companyId
                    }
                }
            }
        })

        const status = await createStatus(
            object.id,
            "DODANO",
            "dodano nowe narzędzie do magazynu"
        )

        // attributes values!
        for (let key in typeAttributes) {

            const attributesValues = await db.attributeValue.create({
                data: {
                    value: typeAttributes[key],
                    itemId: object.id,
                    typeattributeId: key
                }
            })
        }

        return new Response("success")


    } catch (error) {
        console.error(error)
    }
}