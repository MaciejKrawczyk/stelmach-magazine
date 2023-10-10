import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";


export async function GET(req: Request, {params}: Params) {

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

        return new NextResponse( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }
}



export async function DELETE(request: Request, {params}: Params) {

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

        return new NextResponse( JSON.stringify(objects))

    } catch (error) {
        console.error(error)
    }


}



export async function PUT(request: Request, {params}: Params) {


    const { id } = params
    let { shelfId, shelfSize, orderCategoryId, name, isOrder, isDeleted, to, from, parcelId, placeId } = await request.json()

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
                parcel: {
                    connect: {
                        id: Number(parcelId)
                    }
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
                        name: "DODANO DO PACZKI",
                        description: `Przedmiot został dodany do paczki z id ${parcelId}`
                    }
                }
            },
            include: {
                shelf: true,
                parcel: true
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }
}


