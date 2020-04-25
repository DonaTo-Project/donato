# DonaTo

[![ETH Turin 2020](https://img.shields.io/badge/%CE%9E-ETH%20Turin%202020-F64060.svg)](https://ethturin.com)

DonaTo is an application based on Ethereum which aims to bring transparency and accountability to donations.

## How to contribute

To start, clone this repository

`git clone git@github.com:DonaTo-Project/donato.git`

Then `cd donato` and `npm install` to download all the needed dependencies.

### Smart contracts

First of all, make sure you have `truffle` installed, if you don't run `npm i -g truffle`

If you don't need the MoonPay functionalities, Donato can perfectly work with a test blockchain like Ganache (`npm i -g ganache-cli`): to deploy the contracts to your development blockchain run `truffle compile` and then `truffle migrate`.
Otherwise if you need to interact with the MoonPay API, the contracts have to be deployed on Ropsten: in order to do that run `truffle compile` and then `truffle migrate --ropsten`.

### Environment variables

Since we are using MoonPay, Fortmatic and Infura, an API key for these services is needed. In order to supply them to the app create a `.env` file in the root of the project and inside put the needed API keys with this format:
`FORTMATIC_KEY="YOUR_FORTMATIC_KEY" MOONPAY_KEY="YOUR_MOONPAY_KEY" INFURA_KEY="YOUR_INFURA_KEY" FUNDING_ACCOUNT_PRIVATE_KEY="YOUR_FUNDING_ACCOUNT_PRIVATE_KEY"`

### Run the project

To start the project in development mode run `npm run start`, to build it for production `npm run build`

## License

[MIT](https://github.com/DonaTo-Project/donato/blob/master/LICENSE)
