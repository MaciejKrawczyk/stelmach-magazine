import {NextResponse} from "next/server";
import {db} from "@/src/lib/db/db";

export async function PUT(request: Request, {params}: Params): Promise<NextResponse> {
  
  const {id} = params;
  const body = await request.json();
  
  let attributeValues = [];
  for (const [key, value] of Object.entries(body.attributeValue)) {
    attributeValues.push({
      where: {
        id: Number(key)
      },
      data: {
        value: value
      }
    });
  }
  
  console.log(attributeValues);
  
  for (const attrValue of attributeValues) {
    await db.attributeValue.update(attrValue);
  }
  
  try {
    const object = await db.item.update({
      where: {
        id: Number(id)
      },
      data: {
        name: body.name,
        shelfSize: body.shelfSize,
        description: body.description,
        status: {
          create: {
            name: "EDYCJA",
            description: `Dane przedmiotu zostały zmienione`
          }
        }
      },
      include: {
        shelf: true,
        parcel: true,
        attributeValue: true
      }
    });
    
    return NextResponse.json({object});
    
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal server error", {status: 500});
  }
}
