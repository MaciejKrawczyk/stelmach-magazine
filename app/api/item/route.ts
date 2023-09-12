import {db} from "@/lib/db/db";
import {createStatus} from "@/lib/db/createStatus";


export async function GET(req: Request) {
    try {

        const objects = await db.item.findMany({
            include: {
                company: true,
                itemType: true,
                status: true,
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

        const {companyId, description, itemType, name, placeId, shelfType, typeAttributes, shelfId } = body

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
                        id: Number(itemType)
                    }
                },
                shelf: {
                    connect: {
                        id: shelfId
                    }
                },
                placeId: Number(placeId),
                shelfType: shelfType,
                company: {
                    connect: {
                        id: Number(companyId)
                    }
                },
                status: {
                    create: {
                        name: "dodano",
                        description: "dodano przedmiot"
                    }
                }
            },
            include: {
                shelf: true
            }
        })

        // const status = await createStatus(
        //     String(object.id),
        //     "DODANO",
        //     "dodano nowe narzędzie do magazynu"
        // )

        // attributes values!
        for (let key in typeAttributes) {

            const attributesValues = await db.attributeValue.create({
                data: {
                    value: typeAttributes[key],
                    itemId: object.id,
                    typeattributeId: Number(key)
                }
            })
        }

        return new Response(JSON.stringify(object))


    } catch (error) {
        console.error(error)
    }
}