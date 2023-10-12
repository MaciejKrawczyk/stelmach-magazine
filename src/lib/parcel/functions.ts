import { db } from '@/src/lib/db/db'
import {IParcel} from "@/src/types/zod/Parcel";


export async function createParcel(parcel: IParcel) {
  const object = await db.parcel.create({
    data: parcel
  })
}