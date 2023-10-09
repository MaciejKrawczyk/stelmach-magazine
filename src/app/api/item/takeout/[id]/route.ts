import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(request: Request, {params}: Params) {

    const { id } = params

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                shelfId: null,
                placeId: -1,
                status: {
                    create: {
                        name: "WYJĘTO",
                        description: "Wyjęto przedmiot z magazynu"
                    }
                }
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {
        console.error(e)
    }
}