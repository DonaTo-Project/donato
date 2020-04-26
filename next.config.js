module.exports = {
  env: {
    FORTMATIC_KEY: process.env.FORTMATIC_KEY,
    MOONPAY_KEY: process.env.MOONPAY_KEY,
    CHAIN_TYPE: process.env.CHAIN_TYPE,
    FUNDING_ACCOUNT_PRIVATE_KEY: process.env.FUNDING_ACCOUNT_PRIVATE_KEY,
  },
  build: {
    env: {
      FORTMATIC_KEY: process.env.FORTMATIC_KEY,
      MOONPAY_KEY: process.env.MOONPAY_KEY,
      CHAIN_TYPE: process.env.CHAIN_TYPE,
      FUNDING_ACCOUNT_PRIVATE_KEY: process.env.FUNDING_ACCOUNT_PRIVATE_KEY,
    },
  },
};
