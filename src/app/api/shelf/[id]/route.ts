import {db} from "@/src/lib/db/db";
import {NextResponse} from "next/server";
import {Request} from "next/dist/compiled/@edge-runtime/primitives";


export async function PUT(request: Request, {params}: Params) {

    const { id } = params
    const { categoryId } = await request.json()

    try {
        console.log("categoryId w route", categoryId)
        const object = await db.shelf.update({
            where: {
                id: Number(id)
            },
            data: {
                shelfCategoryId: Number(categoryId)
            }
        })
        return NextResponse.json({ object }, { status: 200 })

    } catch (e) {

        console.error(e)

    }
}