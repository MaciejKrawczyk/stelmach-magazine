import { db } from '@/src/lib/db/db'
import {IItem} from "@/src/types/zod/Item";

export async function createItem(item: IItem) {
  
  const object = db.item.create({
    data: item
  })
  return object
  
}

export async function updateItem(item: IItem) {
  const object = db.item.update({
    where: {
      id: item.id
    },
    data: item
  })
}