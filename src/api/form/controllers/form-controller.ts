/**
 * A set of functions called "actions" for `form-controller`
 */

export default {
  async create(ctx, next) {
    const { data } = ctx.request.body;

    const formData: { name: string; email: string } = {
      name: data.name,
      email: data.email,
    };

    const reCaptchaToken = data.gRecaptchaToken;

    if (
      strapi.service("api::form.re-captcha").validate({ token: reCaptchaToken })
    ) {
      strapi.documents("api::form.form").create({
        data: { data: formData },
      });

      ctx.status = 201;
      return { ok: true, confirmed: true, data: formData };
    }

    await strapi.service("api::form.form").createPendingForm({ formData });

    strapi.service("api::email.email").send({ to: formData.email });

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
