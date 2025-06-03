/**
 * A set of functions called "actions" for `form-controller`
 */

import z from "zod/v4";

export default {
  async create(ctx, next) {
    const body = ctx.request.body;

    const validateResult: z.ZodSafeParseResult<{
      name: string;
      email: string;
      gRecaptchaToken: string;
    }> = strapi.service("api::form.validate").formSubmitRequest({ body });

    if (!validateResult.success) {
      ctx.status = 400;
      return { ok: false, error: validateResult.error };
    }

    const { data } = validateResult;

    const { gRecaptchaToken } = data;
    const reCaptchaResult: boolean = await strapi
      .service("api::form.re-captcha")
      .validate({ token: gRecaptchaToken });

    if (reCaptchaResult) {
      strapi.documents("api::form.form").create({
        data: { data },
      });

      ctx.status = 201;
      return {
        ok: true,
        confirmed: true,
        data: { ...validateResult.data, gRecaptchaToken: undefined },
      };
    }

    const pendingForm = await strapi
      .service("api::form.form")
      .createPendingForm({ formData: validateResult.data });

    strapi.service("api::email.email").send({
      to: validateResult.data.email,
      content: `<a href=\"frontend.net/aanvragen/confirm?token=${pendingForm.token}\">Click to confirm</a>`,
    });

    return {
      ok: true,
      confirmed: false,
      data: { ...validateResult.data, gRecaptchaToken: undefined },
    };
  },

  async confirm(ctx, next) {
    const { body } = ctx.request;

    const validateResult: z.ZodSafeParseResult<{
      token: string;
    }> = strapi.service("api::form.validate").confirmRequest({ body });

    if (!validateResult.success) {
      ctx.status = 400;
      return { ok: false, error: validateResult.error };
    }

    const { token } = validateResult.data;

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
      return { ok: false, message: "Pending form is not found" };
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

    ctx.status = 201;
    return { ok: true, data: confirmedForm.data };
  },
};
