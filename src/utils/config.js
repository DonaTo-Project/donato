const fortmaticNetwork =
  process.env.CHAIN_TYPE === "testnet"
    ? "ropsten"
    : {
        rpcUrl: "http://127.0.0.1:7545", // your own node url
        chainId: 5777, // chainId of your own node
      };

export { fortmaticNetwork };
