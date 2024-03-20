import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

import { db } from './db'

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
  db,
})
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
