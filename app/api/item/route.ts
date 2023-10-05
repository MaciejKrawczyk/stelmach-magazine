import {db} from "@/lib/db/db";
import {generateRandomUUID} from "@/utils/generateRandomUUID";


export async function GET(req: Request) {
    try {

        const objects = await db.item.findMany({
            include: {
                attributeValue: {
                    include: {
                        typeAttribute: true
                    }
                },
                company: true,
                itemType: true,
                status: true,
                shelf: true,
                orderCategory: true,
                parcelCategory: true
            },
            where: {
                isDeleted: false
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
        let {
            companyId,
            description,
            itemTypeId,
            name,
            placeId,
            shelfSize,
            attributes,
            shelfId,
            isOrder,
            orderCategoryId
        } = body

        let status
        let object

        if (isOrder) {
            status = {
                name: 'ZAMÓWIONO',
                description: 'zamówiono przedmiot'
            }
        } else {
            status = {
                name: 'DODANO',
                description: 'dodano nowy przedmiot do magazynu'
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

        let typeAttributesArray = []
        for (let key in attributes) {
                const data = {
                    value: attributes[key],
                    typeAttributeId: Number(key)
                }
                typeAttributesArray.push(data)
        }

        if (isOrder) {

            object = await db.item.create({
                data: {
                    orderCategory: {
                        connect: {
                            id: Number(orderCategoryId)
                        }
                    },
                    name: `ORDER_${generateRandomUUID()}`,
                    description: description,
                    itemType: {
                        connect: {
                            id: Number(itemTypeId)
                        }
                    },
                    attributeValue: {
                        createMany: {
                            data: typeAttributesArray
                        }
                    },
                    placeId: Number(placeId),
                    shelfSize: shelfSize,
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
                            id: Number(itemTypeId)
                        }
                    },
                    shelf: {
                        connect: {
                            id: shelfId
                        }
                    },
                    placeId: Number(placeId),
                    shelfSize: shelfSize,
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
                    },
                    attributeValue: {
                        createMany: {
                            data: typeAttributesArray
                        }
                    }
                },
                include: {
                    attributeValue: {
                        include: {
                            typeAttribute: true
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

        return new Response(JSON.stringify(object))

    } catch (error) {
        console.error(error)
    }
}