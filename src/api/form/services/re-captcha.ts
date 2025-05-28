export default () => ({
  validate({ token }) {
    return token === "1234";
  },
});
