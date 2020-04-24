import { useState } from "react";

import Layout from "../components/layout";
import TextBox from "../components/textbox";
import TextArea from "../components/textarea";
import SegmentedButton from "../components/SegmentedButton";

function JoinList() {
  const [requestor, setRequestor] = useState({
    name: "",
    description: "",
    category: "SME",
    fiscalId: "",
  });

  function handleFieldChange(field, value) {
    setRequestor({ ...requestor, [field]: value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    console.log("breh");
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h2 className="mb-3 text-xl font-bold">Join list</h2>
        <p className="mb-6">
          Are you a SME or a no-profit foundation? Join the list! We just gotta
          verify a couple things...
        </p>
        <form
          className="flex flex-col p-4 border-2 border-gray-200 rounded-lg"
          onSubmit={handleFormSubmit}
        >
          <h2 className="mb-3 text-lg font-bold">Hi!</h2>
          <div className="flex flex-col space-y-4">
            <TextBox
              value={requestor.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              label="Who are you?"
            />
            <SegmentedButton
              label="In which category do you fall into?"
              selected={requestor.category}
              options={[
                "SME",
                "Commercial association",
                "No profit association",
              ]}
              onChange={(option) => handleFieldChange("category", option)}
            />
            <TextArea
              value={requestor.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              label="What do you do?"
            />
            <TextBox
              value={requestor.fiscalId}
              onChange={(e) => handleFieldChange("fiscalId", e.target.value)}
              label={`Your ${
                requestor.category !== "No profit association"
                  ? "VAT number"
                  : "fiscal code"
              }`}
            />
            <button
              type="submit"
              className="w-full p-2 text-white bg-purple-700 rounded-md sm:w-1/2 md:w-1/4 hover:bg-purple-600"
            >
              Submit application
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default JoinList;
