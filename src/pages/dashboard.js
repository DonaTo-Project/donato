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
import Axios from "axios";
import convertERC20BalanceToDecimal from "../utils/convertERC20BalanceToDecimal";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const [contract, setContract] = useState({
    balance: 0,
    address: "",
  });

  async function retrieveAddressAndBalance() {
    let Donato = Contract(DonatoContract);
    Donato.setProvider(window.web3.currentProvider);
    let DonatoInstance = await Donato.deployed();

    let ERC20 = Contract(ERC20Contract);
    ERC20.setProvider(window.web3.currentProvider);
    let ERC20Instance = await ERC20.deployed();

    const receiverContractAddress = await DonatoInstance.receiversContractAddresses.call(
      user.address
    );

    const receiversBalance = await ERC20Instance.balanceOf(
      receiverContractAddress
    );

    const balance = convertERC20BalanceToDecimal(receiversBalance);

    const { data } = await Axios.get(
      "https://api.moonpay.io/v3/currencies/dai/price?apiKey=pk_test_nFTOyIHQO2eGhHDG9NPNUJhMQX7Wjlfw"
    );

    setContract({
      balance: (balance * data.EUR).toFixed(2),
      address: receiverContractAddress,
    });
  }

  useEffect(() => {
    (async () => {
      try {
        await retrieveAddressAndBalance();
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
      let DonatoReceiver = Contract(DonatoReceiverContract);
      DonatoReceiver.setProvider(window.web3.currentProvider);
      let DonatoReceiverInstance = await DonatoReceiver.at(contract.address);

      await DonatoReceiverInstance.withdrawCall(cashoutInfo.reason, {
        from: user.address,
      });

      await retrieveAddressAndBalance();

      console.log("Submitted");
    }
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h2 className="mb-3 text-xl font-bold">Your balance</h2>
        <p className="mb-6 font-mono text-xl">{contract.balance} €</p>
        <form
          className="flex flex-col p-4 border-2 border-gray-200 rounded-lg"
          onSubmit={handleFormSubmit}
        >
          <div className="space-y-6">
            <TextArea
              label="For what are you gonna spend these funds for?"
              value={cashoutInfo.reason}
              onChange={(e) => handleFieldChange("reason", e.target.value)}
              error={validationErrors.reason}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={contract.balance == 0}
            >
              Cash out
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Dashboard;
