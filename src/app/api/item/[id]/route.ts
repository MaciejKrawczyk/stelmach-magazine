import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";


export async function GET(req: Request, {params}: Params): Promise<Response> {

    const { id } = params;

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
        });

        return new Response(JSON.stringify(objects));

    } catch (error) {
        console.error(error);
        // It's a good practice to return a response even in case of errors
        return new Response("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: Request, {params}: Params): Promise<Response> {

    const { id } = params;

    try {

        const objects = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                isDeleted: true,
                shelfId: null,
            }
        });

        return new Response(JSON.stringify(objects));

    } catch (error) {
        console.error(error);
        return new Response("Internal server error", { status: 500 });
    }
}

interface PutBody {
    shelfId?: number;
    shelfSize?: string;
    orderCategoryId?: number;
    name?: string;
    isOrder?: boolean;
    isDeleted?: boolean;
    to?: string;
    from?: string;
    parcelId?: number;
    placeId?: number;
}

export async function PUT(request: Request, {params}: Params): Promise<NextResponse> {

    const { id } = params;
    const { shelfId, shelfSize, orderCategoryId, name, isOrder, isDeleted, to, from, parcelId, placeId }: PutBody = await request.json();

    const resolvedPlaceId = placeId || 1;

    try {
        const object = await db.item.update({
            where: {
                id: Number(id)
            },
            data: {
                parcel: {
                    disconnect: true
                },
                name: name,
                isOrder: isOrder,
                isDeleted: isDeleted,
                orderCategory: {
                    disconnect: true,
                },
                placeId: Number(resolvedPlaceId),
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
                parcel: true
            }
        });

        return NextResponse.json({ object });

    } catch (e) {
        console.error(e);
        return new NextResponse("Internal server error", { status: 500 });
    }
}