import express from 'express'
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express'

import { createContext } from './api/trpc'
import { appRouter } from './api/root'

export * from './generated/client'

const app = express()

app.use(cors())

app.use('/', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
}))

app.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
