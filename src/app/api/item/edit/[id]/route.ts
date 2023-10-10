import {NextResponse} from "next/server";
import {db} from "@/src/lib/db/db";

export async function PUT(request: Request, {params}: Params): Promise<NextResponse> {

    const { id } = params;
    const { shelfId, shelfSize, orderCategoryId, name, isOrder, isDeleted, to, from, parcelId, placeId } = await request.json();

    const resolvedPlaceId = placeId || 1;
    // TODO finish put request for editing the item parameters
    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name,
                placeId: Number(resolvedPlaceId),
                shelfSize: shelfSize,
                status: {
                    create: {
                        name: "EDYCJA",
                        description: `Dane przedmiotu zostały zmienione`
                    }
                }
            },
            include: {
                shelf: true,
                parcel: true
            }
        });

        return NextResponse.json({ object });

    } catch (e) {
        console.error(e);
        return new NextResponse("Internal server error", { status: 500 });
    }
}