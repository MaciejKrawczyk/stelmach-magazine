import {db} from "@/lib/db/db";
import {NextResponse} from "next/server";


export async function GET(req: Request, {params}) {

    const { id } = params

    try {

        const objects = await db.item.findFirst({
            where: {
                id: Number(id),
                isDeleted: false
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

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}



export async function DELETE(request, {params}) {

    const { id } = params

    try {

        const objects = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                isDeleted: true,
                shelfId: -1,
            }
        })

        return new Response( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }


}



export async function PUT(request, {params}) {


    const { id } = params
    let { shelfId, shelfSize, orderCategoryId, name, isOrder, isDeleted, to, from, parcelCategoryId, placeId } = await request.json()

    if (!placeId) {
        placeId = 1
    }

    console.log(shelfId)

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                parcelCategory: {
                    disconnect: true
                },
                name: name,
                isOrder: isOrder,
                isDeleted: isDeleted,
                orderCategory: {
                  disconnect: true,
                },
                placeId: Number(placeId),
                shelf: shelfId !== null ? {
                    connect: {
                        id: Number(shelfId)
                    }
                } : {
                    disconnect: true
                },
                shelfSize: shelfSize,
                status: {
                    create: {
                        name: "ZREALIZOWANO",
                        description: `zamówiony przedmiot ${from} dodane do ${to}`
                    }
                }
            },
            include: {
                shelf: true,
                parcelCategory: true
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }
}


