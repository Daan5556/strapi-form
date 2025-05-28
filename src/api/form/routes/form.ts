/**
 * form router
 */

const formRoutes = {
  routes: [
    {
      method: "POST",
      path: "/forms",
      handler: "api::form.form-controller.create",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/forms-confirm",
      handler: "api::form.form-controller.confirm",
      config: {
        auth: false,
      },
    },
  ],
};

export default formRoutes;
