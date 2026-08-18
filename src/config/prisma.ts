import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../config/env'

declare global {
  var prismaGlobal: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
})

export const prisma =
  global.prismaGlobal ??
  new PrismaClient({
    adapter,
  })

if (env.node_env !== 'production') {
  global.prismaGlobal = prisma
}
