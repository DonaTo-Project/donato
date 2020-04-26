const fortmaticNetwork =
  process.env.CHAIN_TYPE === "testnet"
    ? "ropsten"
    : {
        rpcUrl: process.env.CHAIN_API_URL, // your own node url
        chainId: 5777, // chainId of your own node
      };

export { fortmaticNetwork };
