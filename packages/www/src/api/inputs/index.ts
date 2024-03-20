import { z } from 'zod'

// import { env } from '~/env'
const QUERY_INPUT_PAGE_SIZE = 10
const QUERY_INPUT_ORDER_TYPE = 'ASC'

export const BasePageInfo = z.object({
  page: z.optional(z.number()).default(1),
  pageSize: z.optional(z.number()).default(QUERY_INPUT_PAGE_SIZE),
})

export const BaseFilterInfo = z.object({
  keywords: z.optional(z.string().default('')),
  categoryIds: z.optional(z.array(z.number())).default([])
})

export const BaseOrderInfo = z.object({
  createAt: z.optional(z.string()).default(QUERY_INPUT_ORDER_TYPE),
})

export const BaseQueryDto = z.object({
  ids: z.optional(z.array(z.number())).default([]),
  keywords: z.optional(z.string()),
})
