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
    let { shelfId, shelfType, orderCategoryId, name, isOrder, isDeleted, to, from, itemSentCategoryId, placeId } = await request.json()

    if (!placeId) {
        placeId = 1
    }


    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                itemSentCategory: {
                    connect: {
                        id: Number(itemSentCategoryId)
                    }
                },
                name: name,
                isOrder: isOrder,
                isDeleted: isDeleted,
                orderCategory: {
                  disconnect: true,
                },
                placeId: placeId,
                shelf: {
                    connect: {
                        id: Number(shelfId)
                    }
                },
                shelfType: shelfType,
                status: {
                    create: {
                        name: "zamówienie zrealizowane",
                        description: `narzędzie z ${from} dodane do ${to}`
                    }
                }
            },
            include: {
                shelf: true,
                itemSentCategory: true
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }
}


