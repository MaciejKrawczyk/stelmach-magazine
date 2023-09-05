import {db} from "@/lib/db";


export async function GET(req: Request) {
    try {

        // const body = await req.json()
        const companies = await db.company.findMany()

        return new Response( JSON.stringify(companies))

    } catch (error) {
        console.error(error)
    }
}




export async function POST(req: Request) {

    try {

        const body = await req.json()
        const { name, notes } = body

        const companyExists = await db.company.findFirst({
            where: {
                name
            }
        })

        if (companyExists) {
            return new Response('company already exists', { status: 409 })
        }

        const company = await db.company.create({
            data: {
                name: name,
                notes: notes
            }
        })

        return new Response(JSON.stringify(company))

    } catch (error) {
        console.error(error)
    }



}