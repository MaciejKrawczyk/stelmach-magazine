import {db} from "@/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(request, {params}) {

    const { id } = params

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                shelfId: -1,
                placeId: -1,
                status: {
                    create: {
                        name: "wyjęto",
                        description: "wyjęto z magazynu"
                    }
                }
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {
        console.error(e)
    }
}