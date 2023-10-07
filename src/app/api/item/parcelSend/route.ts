import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(req) {

    try {
        const body = await req.json()
        const { itemIds, placeId, parcelId } = body
        let object
        for (let i=0;i<itemIds.length;i++) {
            object = await db.item.update({
                where: {
                    id: Number(itemIds[i])
                },
                data: {
                    placeId: Number(placeId),
                    shelf: {
                        disconnect: true
                    },
                    parcel: {
                        update: {
                            isSent: true
                        }
                    },
                    status: {
                        create: {
                            name: "WYSŁANO",
                            description: `Wysłano paczkę nr ${parcelId} do ostrzenia!`
                        }
                    },
                },
            })
        }
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }

}