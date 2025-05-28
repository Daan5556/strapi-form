/**
 * email service
 */

export default () => ({
  async send({ to }) {
    strapi.log.info(`Sending mail to: ${to}`);
  },
});
