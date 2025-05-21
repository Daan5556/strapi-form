/**
 * form controller
 */

import { factories } from "@strapi/strapi";
import crypto from "crypto";

export default factories.createCoreController("api::form.pending-form", () => ({
  async create(ctx, next) {
    const token = crypto.randomBytes(32).toString("hex");
    const { data } = ctx.request.body;
    // TODO Validate input (body)
    const sanitized = await this.sanitizeInput(data, ctx);

    strapi.documents("api::form.pending-form").create({
      data: {
        token,
        email: data.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // + 1 hour
      },
    });

    console.log(
      `Sending mail to {email} content: Click to confirm: <a href=\"http://frontend.net/aanvragen/confirm?token=${token}\"`
    );

    return { ok: true, message: "Confirmation email sent" };
  },
}));
