import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const Contract = require("@truffle/contract");

import DonatoReceiverContract from "../../build/contracts/DonatoReceiver.json";
import DonatoContract from "../../build/contracts/Donato.json";
import ERC20Contract from "../../build/contracts/ERC20Mintable.json";

import Layout from "../components/Layout";
import Button from "../components/Button";
import TextBox from "../components/TextBox";
import TextArea from "../components/TextArea";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        let Donato = Contract(DonatoContract);
        Donato.setProvider(window.web3.currentProvider);
        let DonatoInstance = await Donato.deployed();

        // let DonatoReceiver = Contract(DonatoReceiverContract);
        // DonatoReceiver.setProvider(window.web3.currentProvider);
        // let DonatoReceiverInstance = await DonatoReceiver.deployed();

        let ERC20 = Contract(ERC20Contract);
        ERC20.setProvider(window.web3.currentProvider);
        let ERC20Instance = await ERC20.deployed();

        const receiverContractAddress = await DonatoInstance.receiversContractAddresses.call(
          user.address
        );

        const receiversBalance = await ERC20Instance.balanceOf(
          receiverContractAddress
        );

        var BN = web3.utils.BN;

        setBalance(Number(new BN(receiversBalance).toString()));

        console.log(balance == 0);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const [isCashingOut, setIsCashingOut] = useState(false);

  const [cashoutInfo, setCashoutInfo] = useState({
    amount: 0,
    reason: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => setValidationErrors({ ...validationErrors, amount: "" }), [
    cashoutInfo.amount,
  ]);
  useEffect(() => setValidationErrors({ ...validationErrors, reason: "" }), [
    cashoutInfo.reason,
  ]);

  function handleFieldChange(field, value) {
    setCashoutInfo({ ...cashoutInfo, [field]: value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    let hasErrored = false;
    if (false) {
      //cashoutInfo.amount == 0) {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          amount: "Please set a valid amount",
        };
      });
      hasErrored = true;
    }

    if (cashoutInfo.reason.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          reason:
            "Please insert a reason for the withdrawal, so that you can be transparent to your donors",
        };
      });
      hasErrored = true;
    }

    if (!hasErrored) {
      let Donato = Contract(DonatoReceiverContract);
      Donato.setProvider(window.web3.currentProvider);
      let DonatoInstance = await Donato.deployed();
      // .at(
      //   "0x290DcEB0ce348c02D6B96e092F21Abe7BdcF60D7"
      // );

      // await DonatoInstance.sendApplication(
      //   requestor.name,
      //   requestor.category,
      //   requestor.description,
      //   requestor.countryId,
      //   requestor.fiscalId,
      //   { from: user.address }
      // );

      console.log("Submitted");
    }
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h2 className="mb-3 text-xl font-bold">Your balance</h2>
        <p className="mb-6 font-mono text-xl">{balance} €</p>
        <form
          className="flex flex-col p-4 border-2 border-gray-200 rounded-lg"
          onSubmit={handleFormSubmit}
        >
          <div className="space-y-6">
            {/* <TextBox
              label="How much do you want to withdraw?"
              type="number"
              value={cashoutInfo.amount}
              onChange={(e) => handleFieldChange("amount", e.target.value)}
              min="0"
              error={validationErrors.amount}
            /> */}
            <TextArea
              label="For what are you gonna spend these funds for?"
              value={cashoutInfo.reason}
              onChange={(e) => handleFieldChange("reason", e.target.value)}
              error={validationErrors.reason}
            />
            <Button type="submit" variant="primary" disabled={balance == 0}>
              Cash out
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Dashboard;
