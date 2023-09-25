import {db} from "@/lib/db/db";
import {NextResponse} from "next/server";


export async function PUT(request, {params}) {

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