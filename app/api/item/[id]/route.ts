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
    const { shelfId, shelfType, orderCategoryId, name, isOrder, isDeleted, to, from } = await request.json()


    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name,
                isOrder: isOrder,
                isDeleted: isDeleted,
                orderCategory: {
                  disconnect: true,
                },
                placeId: 1,
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
                shelf: true
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }
}


