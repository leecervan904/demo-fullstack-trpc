import { PrismaClient } from "@prisma/client"

export * from '../generated/client'

export const db = new PrismaClient()
