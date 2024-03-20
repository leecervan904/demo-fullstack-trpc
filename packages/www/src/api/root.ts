import { createTRPCRouter } from './trpc'
import { todoRouter } from './routers/todo'

export const appRouter = createTRPCRouter({
  todoRouter,
})

export type AppRouter = typeof appRouter