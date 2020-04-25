import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import SegmentedButton from "../components/SegmentedButton";

const options = ["Add to recipients list", "Cash outs"];

function AcceptRequests(props) {
  const [addToRecipientsList, setAddToRecipientsList] = useState([]);
  const [cashoutsList, setCashoutsList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    setAddToRecipientsList([
      {
        name: "NoProfit",
        type: "No profit association",
        description: "We really need money",
        fiscalId: "123456789",
      },
      {
        name: "Macelleria Amatrice",
        type: "SME",
        description:
          "We're the pride of our town, but due to the earthquake it's really possible that we'll close",
        fiscalId: "45678919",
      },
    ]);

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
  }, []);

  function renderRequests() {
    let jsx = "";

    switch (selectedOption) {
      case "Add to recipients list":
        jsx = addToRecipientsList.map((request, i) => (
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
                onClick={() => changeRequestState("accepted")}
              >
                Accept
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => changeRequestState("denied")}
              >
                Deny
              </Button>
            </div>
          </div>
        ));
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
