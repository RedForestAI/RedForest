import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(({ ctx }) => {
    return ctx.db.profile.findFirstOrThrow({
      where: {
        id: ctx.user.id,
      },
    });
  }),
});
