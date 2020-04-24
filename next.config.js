module.exports = {
  env: {
    FORTMATIC_KEY: process.env.FORTMATIC_KEY,
  },
  build: {
    env: { FORTMATIC_KEY: process.env.FORTMATIC_KEY },
  },
};
