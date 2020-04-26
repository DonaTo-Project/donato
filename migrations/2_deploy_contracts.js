const ERC20Mintable = artifacts.require("ERC20Mintable");
const MoonPayTokenAddress = "0x48B0C1D90C3058ab032C44ec52d98633587eE711";
const Donato = artifacts.require("Donato");

module.exports = function (deployer) {
  deployer.then(async () => {
    if (process.env.CHAIN_TYPE === "local") {
      await deployer.deploy(ERC20Mintable);
      await deployer.deploy(Donato, ERC20Mintable.address);
    } else if (process.env.CHAIN_TYPE === "testnet")
      await deployer.deploy(Donato, MoonPayTokenAddress);
  });
};
