// const ERC20Mintable = artifacts.require("ERC20Mintable");//uncomment to run test
const MoonPayTokenAddress = "0x48B0C1D90C3058ab032C44ec52d98633587eE711";//Comment this line to run test
const Donato = artifacts.require("Donato");
//
module.exports = function(deployer) {
	deployer.then(async () => {
      // await deployer.deploy(ERC20Mintable);//Uncomment to run test
      // await deployer.deploy(Donato, ERC20Mintable.address);//Uncomment to run test
      await deployer.deploy(Donato, MoonPayTokenAddress);//Comment to run test
  })
};