import {db} from '@/src/lib/db/db'
import {IShelfCategory} from "@/src/types/zod/Shelf";


export async function findFirstShelfCategory(id: number) {
        const object = await db.shelfCategory.findFirst({
            where: {
                id: id
            },
            include: {
                shelf: true
            }
        })
        return object
}


export async function findManyShelfCategory() {
    const objects = await db.shelfCategory.findMany({
        include: {
            shelf: true
        }
    })
    return objects
}


export async function createShelfCategory(shelfCategory: IShelfCategory) {
    
    const objectExists = await db.shelfCategory.findFirst({
        where: {
            name: shelfCategory.name
        }
    })
    if (objectExists) {
        return new Error('shelf-category already exists')
    }
    
    const object = await db.shelfCategory.create({
        data: shelfCategory
    });
    
    return object
}

