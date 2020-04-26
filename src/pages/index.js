import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Web3 from "web3";
import Axios from "axios";
import Contract from "@truffle/contract";
import Router from "next/router";

import Button from "../components/Button";
import Layout from "../components/Layout";

const DonatoContract = require("../../build/contracts/Donato.json");
const DonatoReceiverContract = require("../../build/contracts/DonatoReceiver.json");
const ERC20Contract = require("../../build/contracts/ERC20Mintable.json");

function Home(props) {
  const [campaigns, setCampaigns] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let Donato = Contract(DonatoContract);
      Donato.setProvider(window.web3.currentProvider);
      let DonatoReceiver = Contract(DonatoReceiverContract);
      DonatoReceiver.setProvider(window.web3.currentProvider);
      let ERC20 = Contract(ERC20Contract);
      ERC20.setProvider(window.web3.currentProvider);

      let DonatoInstance = await Donato.deployed();
      let ERC20Instance = await ERC20.deployed();

      const activeReceiversAddresses = await DonatoInstance.getActiveAddresses.call();

      let activeReceivers = await Promise.all(
        activeReceiversAddresses.map(async (address) => {
          try {
            const addressOfReceiverContract = await DonatoInstance.receiversContractAddresses.call(
              address
            );
            const DonatoReceiverInstance = await DonatoReceiver.at(
              addressOfReceiverContract
            );

            const receiversBalance = await ERC20Instance.balanceOf(
              addressOfReceiverContract
            );
            var BN = web3.utils.BN;

            const balance = Number(new BN(receiversBalance).toString());
            const [name, country, description, category] = await Promise.all([
              DonatoReceiverInstance.name.call(),
              DonatoReceiverInstance.country.call(),
              DonatoReceiverInstance.description.call(),
              DonatoReceiverInstance.category.call(),
            ]);

            console.log(`
              balance ${balance}
              name ${name}
              country ${country}
              description ${description}
              category ${category}
            `);

            console.log(DonatoReceiverInstance);

            return {
              balance,
              name,
              country,
              description,
              category,
              address: addressOfReceiverContract,
            };
          } catch (err) {
            console.error(err);
          }
        })
      );

      setCampaigns(activeReceivers);
    })();
  }, []);

  useEffect(() => {
    if (isRedirecting) {
      setTimeout(() => {
        window.location.href = `https://buy-staging.moonpay.io?apiKey=pk_test_nFTOyIHQO2eGhHDG9NPNUJhMQX7Wjlfw&currencyCode=dai&walletAddress=${address}&enabledPaymentMethods=credit_debit_card,sepa_bank_transfer&redirectURL=http://localhost:3000`;
      }, 3500);

      return () => clearTimeout();
    }
  }, [isRedirecting]);

  function redirectToPayment(address) {
    setAddress(address);
    setIsRedirecting(true);
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="pb-8 pl-4 text-3xl">Campaigns</h1>
        <div className="space-y-6">
          {campaigns.map((campaign, i) => (
            <div
              key={i}
              className="flex flex-col justify-between w-full p-4 border-2 border-gray-200 rounded-lg sm:flex-row"
            >
              <div>
                <h2 className="font-bold">{campaign.name}</h2>
                <p className="mb-8 text-gray-700">{campaign.description}</p>
                <span className="p-2 text-purple-800 bg-purple-200 rounded-full">
                  {campaign.balance} € already donated
                </span>
              </div>
              <Button
                type="button"
                variant="text"
                onClick={() => redirectToPayment(campaign.address)}
              >
                Donate
              </Button>
            </div>
          ))}
        </div>
      </div>
      {isRedirecting && (
        <div className="absolute top-0 bottom-0 left-0 right-0 opacity-75">
          <div className="flex items-center justify-center w-full h-full bg-white">
            We are redirecting you to our trusted payment processor...
          </div>
        </div>
      )}
      {props.succesfulPayment && (
        <div className="absolute bottom-0 right-0 p-4 m-8 text-green-800 bg-green-200">
          Your donation went well!
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let {
    transactionId = "",
    transactionStatus = "",
    successfulPayment,
  } = context.query;
  const { res } = context;

  if (process.env.CHAIN_TYPE === "ganache" && transactionId !== "") {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let formattedDate = `${year}-${month}-${day}`;

    const {
      data: transactions,
    } = await Axios.get(
      `https://api.moonpay.io/v1/transactions?startDate=${formattedDate}&endDate=${formattedDate}`,
      { headers: { Authorization: `Api-Key ${process.env.MOONPAY_KEY}` } }
    );

    let [transaction] = transactions.filter(
      (transaction) => transaction.id === transactionId
    );

    let eurAmount = parseInt(transaction.baseCurrencyAmount);
    const { data: quote } = await Axios.get(
      `https://api.moonpay.io/v3/currencies/dai/quote/?apiKey=pk_test_nFTOyIHQO2eGhHDG9NPNUJhMQX7Wjlfw&baseCurrencyAmount=${eurAmount}&baseCurrencyCode=eur&paymentMethod=credit_debit_card`
    );
    let recipientAddress = transaction.walletAddress;

    let [intPart, decPart] = quote.quoteCurrencyAmount.toString().split(".");
    decPart = decPart.padEnd(18, "0");
    let cryptoAmount = Number(`${intPart}${decPart}`);

    try {
      let web3 = new Web3("http://localhost:7545");

      let ERC20 = Contract(ERC20Contract);
      ERC20.setProvider(web3.currentProvider);
      let ERC20Instance = await ERC20.deployed();

      let accountFrom = web3.eth.accounts.privateKeyToAccount(
        process.env.FUNDING_ACCOUNT_PRIVATE_KEY
      );

      await ERC20Instance.transfer(recipientAddress, cryptoAmount, {
        from: accountFrom.address,
      });

      if (typeof window !== "undefined")
        Router.replace("/?successfulPayment=true");
      else {
        res.writeHead(302, { Location: "/?successfulPayment=true" });
        res.end();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    props: {
      successfulPayment:
        successfulPayment || (transactionId !== "" && transactionStatus !== ""),
    },
  };
}

export default Home;
