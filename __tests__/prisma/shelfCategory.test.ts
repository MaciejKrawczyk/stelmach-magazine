import { createShelfCategory } from "@/src/lib/shelfCategory/functions"
import { prismaMock } from "@/src/test/prisma/singleton";

test('should create a new shelf category', async () => {
  
  const object = {
    name: 'nazwa',
    color: '#FFFFFF',
    notes: 'opis opis opis',
  }
  
  prismaMock.shelfCategory.create.mockResolvedValue(object)
  
  await expect(createShelfCategory(object)).resolves.toEqual({
    name: 'nazwa',
    color: '#FFFFFF',
    notes: 'opis opis opis',
  })
})

