import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

app.use(cors());

const prisma = new PrismaClient();
const createContext = (opts: trpcExpress.CreateExpressContextOptions) => {
  console.log(opts.req.headers);
  return { prisma };
};
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context().create();

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "Hello World";
  }),
  helloName: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello World ${input.name}`;
    }),
  todos: t.procedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany();
    console.log(todos);
    return todos;
  }),
});

app.get("/", (_req, res) => res.send("hello")); //削除可能

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export type AppRouter = typeof appRouter;
