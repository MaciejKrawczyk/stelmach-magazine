import {db} from "@/lib/db/db";


export async function GET(req: Request) {
    try {

        const objects = await db.item.findMany({
            include: {
                attributeValue: {
                    include: {
                        typeattribute: true
                    }
                },
                company: true,
                itemType: true,
                status: true,
                shelf: true,
                orderCategory: true
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

        let {companyId, description, itemType, name, placeId, shelfType, typeAttributes, shelfId, isOrder, orderCategoryId } = body

        // const isOrder = placeId === 18
        let status
        let object

        if (isOrder) {
            status = {
                name: 'zamówiono',
                description: 'zamówiono przedmiot'
            }
        } else {
            status = {
                name: 'dodano',
                description: 'dodano przedmiot'
            }
        }

        const objectExists = await db.item.findFirst({
            where: {
                name: name
            }
        })

        if (objectExists) {
            return new Response(`object already exists ${JSON.stringify(objectExists)}`, { status: 409 })
        }


        if (isOrder) {

            object = await db.item.create({
                data: {
                    orderCategory: {
                        connect: {
                            id: Number(orderCategoryId)
                        }
                    },
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
                    isDeleted: false,
                    isOrder: isOrder,
                    company: {
                        connect: {
                            id: Number(companyId)
                        }
                    },
                    status: {
                        create: {
                            name: status.name,
                            description: status.description
                        }
                    }
                },
                include: {
                    shelf: true,
                }
            })

        } else {

            object = await db.item.create({
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
                    isDeleted: false,
                    isOrder: isOrder,
                    company: {
                        connect: {
                            id: Number(companyId)
                        }
                    },
                    status: {
                        create: {
                            name: status.name,
                            description: status.description
                        }
                    }
                },
                include: {
                    attributeValue: {
                        include: {
                            typeattribute: true
                        }
                    },
                    company: true,
                    itemType: true,
                    status: true,
                    shelf: true,
                    orderCategory: true

                }
            })
        }



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