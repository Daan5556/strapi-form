/**
 * A set of functions called "actions" for `form-controller`
 */

import crypto from "crypto";

export default {
  async create(ctx, next) {
    const { data } = ctx.request.body;

    const formData: { name: string; email: string } = {
      name: data.name,
      email: data.email,
    };

    const reCaptchaToken = data.gRecaptchaToken;

    if (verifyRecaptcha(reCaptchaToken)) {
      strapi.documents("api::form.form").create({
        data: { data: formData },
      });

      ctx.status = 201;
      return { ok: true, confirmed: true, data: formData };
    }

    const token = crypto.randomBytes(32).toString("hex");

    await strapi.documents("api::form.pending-form").create({
      data: {
        token: token,
        data: formData,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // + 1 hour
      },
    });

    strapi.log.info(
      `Sending mail to ${data.email} content: Click to confirm: <a href=\"http://frontend.net/aanvragen/confirm?token=${token}\"`
    );

    return { ok: true, confirmed: false, data: formData };
  },

  async confirm(ctx, next) {
    const { data } = ctx.request.body;

    const token = data.token;

    const pendingForm = await strapi
      .documents("api::form.pending-form")
      .findFirst({
        filters: {
          token: {
            $eq: token,
          },
        },
        populate: ["data"],
      });

    if (!pendingForm) {
      strapi.log.warn(
        `Pending form request has form token that is not found in the database. Token: ${token}`
      );
      ctx.status = 400;
      return { message: "Pending form is not found" };
    }

    const [confirmedForm, deletedPendingForm] = await Promise.all([
      strapi
        .documents("api::form.form")
        .create({ data: { data: pendingForm.data }, populate: ["data"] }),

      strapi
        .documents("api::form.pending-form")
        .delete({ documentId: pendingForm.documentId }),
    ]);

    if (deletedPendingForm.entries.length === 0) {
      strapi.log.error(
        `We were expecting that pending form could be deleted but was not. Pending form: ${pendingForm}`
      );
    }

    return { ok: true, data: confirmedForm.data };
  },
};

const verifyRecaptcha = (token: string) => {
  return token === "1234";
};
