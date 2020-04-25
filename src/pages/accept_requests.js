import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function AcceptRequests(props) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests([
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
  }, []);

  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="pb-8 pl-4 text-3xl">Requests</h1>
        <div className="space-y-6">
          {requests.map((request, i) => (
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
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-200"
                  onClick={() => changeRequestState("accepted")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-200"
                  onClick={() => changeRequestState("denied")}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default AcceptRequests;
