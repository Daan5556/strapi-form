/**
 * email service
 */

export default () => ({
  async send({ to, content }) {
    strapi.log.info(`Sending mail to: ${to}. Content: ${content}`);
  },
});
