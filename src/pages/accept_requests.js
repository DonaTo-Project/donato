import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
const Contract = require("@truffle/contract");

import DonatoContract from "../../build/contracts/Donato.json";

import Button from "../components/Button";
import SegmentedButton from "../components/SegmentedButton";
import Layout from "../components/Layout";

const options = ["Add to recipients list", "Cash outs"];

const requestState = {
  DENIED: false,
  ACCEPTED: true,
};

function AcceptRequests(props) {
  const user = useSelector((state) => state.user);

  const [donatoInstance, setDonatoInstance] = useState({});
  const [recipientsList, setRecipientsList] = useState([]);
  const [cashoutsList, setCashoutsList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    (async () => {
      let Donato = Contract(DonatoContract);
      Donato.setProvider(window.web3.currentProvider);
      const DonatoInstance = await Donato.deployed();
      setDonatoInstance(DonatoInstance);
      // at(
      //   "0x290DcEB0ce348c02D6B96e092F21Abe7BdcF60D7"
      // );

      let pendingAddresses = await DonatoInstance.getPendingAddresses({
        from: user.address,
      });

      console.log(pendingAddresses);

      let requestors = [];
      for await (let address of pendingAddresses) {
        try {
          const candidateData = await DonatoInstance.getCandidateData(address, {
            from: user.address,
          });

          console.log(address);

          requestors.push({
            address,
            name: candidateData.name,
            type: candidateData.category,
            description: candidateData.description,
            fiscalId: candidateData.VAT,
          });
        } catch (err) {
          console.error(err);
        }
      }

      setRecipientsList(requestors);

      setCashoutsList([
        {
          name: "NoProfit",
          type: "No profit association",
          amount: 80,
        },
        {
          name: "NoProfit",
          type: "No profit association",
          amount: 45,
        },
      ]);
    })();
  }, []);

  async function changeRequestState(address, state) {
    try {
      await donatoInstance.evaluateCandidate(address, state, {
        from: user.address,
      });
      setRecipientsList(
        recipientsList.filter((recipient) => recipient.address !== address)
      );
    } catch (err) {
      console.error(err);
    }
  }

  function renderRequests() {
    let jsx = "";

    switch (selectedOption) {
      case "Add to recipients list":
        jsx =
          recipientsList.length === 0 ? (
            <div className="flex flex-col justify-between w-full p-4 sm:flex-row">
              No pending requests!
            </div>
          ) : (
            recipientsList.map((request, i) => (
              <div
                key={i}
                className="flex flex-col justify-between w-full p-4 border-2 border-gray-200 rounded-lg sm:flex-row"
              >
                <div>
                  <div className="flex space-x-4">
                    <h2 className="font-bold">{request.name}</h2>
                    <span className="text-gray-600">{request.type}</span>
                  </div>
                  <p className="mb-8 text-gray-800">{request.description}</p>
                  <span className="text-sm uppercase">
                    {request.type !== "No profit association"
                      ? "VAT Number"
                      : "Fiscal code"}{" "}
                    {request.fiscalId}
                  </span>
                </div>
                <div className="flex flex-row">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      changeRequestState(request.address, requestState.ACCEPTED)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      changeRequestState(request.address, requestState.DENIED)
                    }
                  >
                    Deny
                  </Button>
                </div>
              </div>
            ))
          );
        break;
      case "Cash outs":
        jsx = cashoutsList.map((request, i) => (
          <div
            key={i}
            className="flex flex-col justify-between w-full p-4 border-2 border-gray-200 rounded-lg sm:flex-row"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex space-x-4">
                <h2 className="font-bold">{request.name}</h2>
                <span className="text-gray-600">{request.type}</span>
              </div>
              <p className="font-mono text-lg text-gray-800">
                {request.amount} &euro;
              </p>
            </div>
            <div className="flex flex-row">
              <Button
                type="button"
                variant="text"
                onClick={() => changeRequestState("accepted")}
              >
                Accept
              </Button>
            </div>
          </div>
        ));
        break;
    }

    return jsx;
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="pb-2 pl-4 text-3xl">Requests</h1>
        <div className="p-4">
          <SegmentedButton
            options={options}
            selected={selectedOption}
            onChange={(option) => setSelectedOption(option)}
          />
        </div>
        <div className="space-y-6">{renderRequests()}</div>
      </div>
    </Layout>
  );
}

export default AcceptRequests;
