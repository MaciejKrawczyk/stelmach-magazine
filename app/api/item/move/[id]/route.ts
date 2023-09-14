import {db} from "@/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(request, {params}) {

    const { id } = params
    const { placeId } = await request.json()

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                placeId: Number(placeId),
                shelf: {
                    connect: {
                        id: -1
                    }
                },
                status: {
                    create: {
                        name: "przeniesiono",
                        description: "przeniesiono przedmiot"
                    }
                }
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }

}