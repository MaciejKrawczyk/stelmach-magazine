import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { db } from '@/src/lib/db/db'


jest.mock('src/lib/db/db.ts', () => ({
    __esModule: true,
    db: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>