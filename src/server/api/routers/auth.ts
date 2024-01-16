import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(({ ctx }) => {
    if (!ctx.user.data.user) {
      throw new Error("User is not authenticated");
    }
    return ctx.db.profile.findFirstOrThrow({
      where: {
        id: ctx.user.data.user.id,
      },
    });
  }),
});
