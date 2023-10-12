import {db} from '@/src/lib/db/db'
import {IStatus} from "@/src/types/zod/Status";


export async function createStatus(status: IStatus) {
  const object = await db.status.create({
    data: status
  })
  return object
}

