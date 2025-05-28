/**
 * email service
 */

export default () => ({
  async send({ to, content }) {
    strapi.log.info(`Sending mail to: ${to}. Content: ${content}`);

    await strapi.plugins["email"].services.email.send({
      to: "egdaan@gmail.com",
      from: "noreply@kunsttheatermedia.nl",
      replyTo: "valid email address",
      subject: "The Strapi Email feature worked successfully",
      text: "Hello world!",
      html: `<h1>Hello World</h1><img src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/E802/production/_89649395_instagram_logo_976.jpg" /><a href="https://kunsttheatermedia.nl">Click to confirm</a>`,
    });
  },
});
