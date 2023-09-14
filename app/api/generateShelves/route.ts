import {db} from "@/lib/db/db";


// export async function GET(req: Request) {
//     try {
//
//         const objects = await db.category.findMany()
//
//         return new Response( JSON.stringify(objects))
//
//     } catch (error) {
//         console.error(error)
//     }
// }



export async function POST(req: Request) {

    try {

        const object = await db.shelf.create({
            data: {
                id: -1,
                name: String(0),
                size: 'big',
                categoryId: 1
            }
        })

        for (let i=0;i<72;i++) {

            const object = await db.shelf.create({
                data: {
                    name: String(i + 1),
                    size: 'big',
                    categoryId: 1
                }
            })

        }

        for (let i=0;i<160;i++) {

            const object = await db.shelf.create({
                data: {
                    name: String(i + 1),
                    size: 'small',
                    categoryId: 1
                }
            })

        }

        return new Response('ok')

    } catch (error) {
        console.error(error)
    }



}