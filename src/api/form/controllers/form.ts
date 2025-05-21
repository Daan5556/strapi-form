/**
 * form controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::form.form", () => ({
  async create(ctx, next) {
    // TODO Validate and sanitize token
    const { token } = await ctx.request.body.data;

    const pending = await strapi
      .documents("api::form.pending-form")
      .findMany({ filters: { token: { $eq: token } }, pageSize: 1 });

    if (pending.length === 0) return ctx.badRequest("Invalid token");

    const pendingDoc = pending[0];

    await strapi
      .documents("api::form.pending-form")
      .delete({ documentId: pendingDoc.documentId });

    return { ok: true, message: "User sent authenticated request" };
  },
}));
