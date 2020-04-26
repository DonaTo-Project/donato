# DonaTo

[![ETH Turin 2020](https://img.shields.io/badge/%CE%9E-ETH%20Turin%202020-F64060.svg)](https://ethturin.com)

DonaTo is an application based on Ethereum which aims to bring transparency and accountability to donations, while avoiding all blockchain jargon and mantaining a easy UX for everyone.

### Main application flows

You can find them [here](https://github.com/DonaTo-Project/donato/blob/master/user_flows)

### Future updates

While with this first version of DonaTo our main goals of speed and transaparency of direct donor-recipient transactions are achieved, there's more to come in order to improve UX and remove as many points of failure as possible:

- In DonaTo, users won't ever have to worry about gas payments. As of now though, this is achieved by using a master centralized wallet, in the future we plan to integrate with the Gas Station Network.

- As of now there's no easy way for the users to convert from crypto to fiat: the only way is to send funds to exchanges and convert them there. Since we don't want to have our users worry about long KYC/AML processes, the people which manage the DonaTo project directly pay the recipients with traditional wire transfers. We absolutely want to change this, so we'll continue following the space in order to improve this part.

- It would be nice for donors to see what was purchased or made with their donations. As of now, what can they see is just a simple text description. We want to improve that by integrating with 3Box, so that every recipient can enrich its own data in order to engage more with donors and be more transparent with them.

## How to run

To start, clone this repository

`git clone git@github.com:DonaTo-Project/donato.git`

Then `cd donato` and `npm install` to download all the needed dependencies.

### Smart contracts

First of all, make sure you have `truffle` installed, if you don't run `npm i -g truffle`

Donato can perfectly work with a test blockchain like Ganache (`npm i -g ganache-cli`): to deploy the contracts to your development blockchain run `truffle compile` and then `truffle migrate`.
If you want to deploy the contracts on Ropsten run `truffle compile` and then `truffle migrate --ropsten`.

### Environment variables

If you want to interact to your locally deployed contracts you have to create a `.env.local` file in the root of the project. Inside that file, create a key=value list with these variables:
`FORTMATIC_KEY="pk_test_FA190E46281CC1FB" MOONPAY_KEY="sk_test_8cev0XeWJN3O22vIMTaajsyn53gMu4Q" FUNDING_ACCOUNT_PRIVATE_KEY="the private key of the same account that you used to deploy the contracts" CHAIN_TYPE="local" CHAIN_API_URL="your chain api url (ex. http://localhost:7545)"`. Yes, the attached keys are free to use for dev purposes, courtesy of DonaTo team 😉

If you want to interact with the contracts deployed on Ropsten you have to create a `.env.testnet` file in the root of the project. Inside that file, create a key=value list with these variables:
`FORTMATIC_KEY="your fortmatic key (You can retrieve it by logging in with your GitHub here https://dashboard.fortmatic.com/login)" FUNDING_ACCOUNT_PRIVATE_KEY="the private key of the same account that you used to deploy the contracts" CHAIN_TYPE="testnet" CHAIN_API_URL="the endpoint to use RPC, can be Infura or some other node"`

### Run the project

You can run the project in two development modes, depending on what chain do you want to use.
If you want to run the project using your previously deployed contracts on your chain run `npm run dev:local`,
otherwise run `npm run dev:testnet`

To build the project for production: `npm run build`

### Interacting locally

Since the only web3 provider available (as of now) is Fortmatic, an email is needed for each user role, so three different email accounts are needed.
You can use personal email accounts or use temporary emails with services like [Temp Mail][https://temp-mail.org].

#### First login: admin

Login with one of your three emails. When you're successfully logged in open the developer console, you should find printed you Ethereum address: copy it and move back to your project folder. Inside the `.env.local` file create before insert another key=value `ADMIN_ACCOUNT="just copied account"`, then run `npm run grant-local-admin-access` in the terminal. You've now gained admin role, with which you can approve or reject requests to be added as a recipient. Move back to the webapp and logout.

#### Second login: recipient of donations (SME/association)

Login with another one of your three emails. When you're successfully logged in go to the "Want to receive donations?" section: here type some info about your organization and submit your application. Then logout.

#### Third login: admin again

Login again with your admin credentials and go to the "Requests section": here you can see yuour previously submitted application, just approve it and logout

#### Purchase: donor

The donor doesn't even need to login: on the homepage he should see the freshly accepted SME/association and should be able to donate to it. By clicking on the Donate button he's redirected to the MoonPay portal in order to complete the purchase. Enter here the last available email and insert card information (Test card: Number 4000 0231 0466 2535, Exp 12/2020, CVC 123). Just buy the minimum of DAI so that you don't have to go through all the fake KYC process. You should then be redirected to the DonaTo homepage, and you should see the balance of the recipient have the same amount of DAI that you purchased.

#### Fourth login: recipient of donations (SME/association) again

Login again with your SME/association credentials and go to the "Your balance" section: here you can see your balance and cashout with a description of the why you're cashing out. Then logout.

All done!

## License

[MIT](https://github.com/DonaTo-Project/donato/blob/master/LICENSE)
