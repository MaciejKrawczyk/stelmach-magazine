import {db} from "@/src/lib/db/db";
import {CompanySchema} from "@/src/types/zod/Company";
import {z} from "zod";


export async function GET(req: Request): Promise<Response> {
    try {
        const companies = await db.company.findMany();
        return new Response(JSON.stringify(companies), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch companies', { status: 500 });
    }
}

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();

        // Validate input using Zod
        const validatedData = CompanySchema.parse(body);

        const companyExists = await db.company.findFirst({
            where: {
                name: validatedData.name
            }
        });

        if (companyExists) {
            return new Response('Company already exists', { status: 409 });
        }

        const company = await db.company.create({
            data: validatedData
        });

        return new Response(JSON.stringify(company), { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid input', { status: 400 });
        }
        console.error(error);
        return new Response('Failed to create company', { status: 500 });
    }
}