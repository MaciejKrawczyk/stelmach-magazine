import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(request, {params}) {

    const { id } = params
    const { placeId, shelfId, from, to } = await request.json()

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                placeId: Number(placeId),
                shelf: {
                    connect: {
                        id: shelfId
                    }
                },
                status: {
                    create: {
                        name: "PRZENIESIONO",
                        description: `Przeniesiono przedmiot z ${from} do ${to}`
                    }
                }
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }

}