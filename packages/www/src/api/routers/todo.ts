import z from 'zod'

import { createTRPCRouter, publicProcedure } from "../trpc"

export const todoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string().default(''),
    }))
    .mutation(({ ctx, input: data }) => {
      return ctx.db.todo.create({ data })
    }),

  delete: publicProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) => {
      return ctx.db.todo.delete({ where: { id } })
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.optional(z.string()),
        content: z.optional(z.string()),
        status: z.optional(z.number()),
      })
    }))
    .mutation(({ ctx, input }) => {
      const { id, data } = input
      console.log(data)
      return ctx.db.todo.update({ where: { id }, data })
    }),

  findOne: publicProcedure
    .input(z.number())
    .query(({ ctx, input: id }) => {
      return ctx.db.todo.findUnique({ where: { id } })
    }),

  findAll: publicProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.db.todo.findMany({})
      return data
    }),

  pages: publicProcedure
    .input(z.object({
      titleKeywords: z.string().default(''),
      contentKeywords: z.string().default(''),
      page: z.number().default(1),
      pageSize: z.number().default(10),
    }))
    .query(({ ctx, input }) => {
      const { titleKeywords, contentKeywords, page, pageSize } = input
      return ctx.db.todo.findMany({
        where: {
          title: { contains: titleKeywords },
          content: { contains: contentKeywords },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      })
    })
})
