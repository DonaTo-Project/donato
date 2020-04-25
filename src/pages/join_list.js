import { useState, useEffect } from "react";

import Layout from "../components/Layout";
import TextBox from "../components/TextBox";
import TextArea from "../components/TextArea";
import SegmentedButton from "../components/SegmentedButton";

function JoinList() {
  const [requestor, setRequestor] = useState({
    name: "",
    description: "",
    category: "SME",
    fiscalId: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    description: "",
    fiscalId: "",
  });

  function handleFieldChange(field, value) {
    setRequestor({ ...requestor, [field]: value });
  }

  useEffect(() => {
    if (requestor.fiscalId.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          fiscalId: `Please insert a valid ${
            requestor.category !== "No profit association"
              ? "VAT number"
              : "fiscal code"
          } so that we can correctly verify you`,
        };
      });
    }
  }, [requestor.category]);

  useEffect(() => setValidationErrors({ ...validationErrors, name: "" }), [
    requestor.name,
  ]);
  useEffect(
    () => setValidationErrors({ ...validationErrors, description: "" }),
    [requestor.description]
  );
  useEffect(() => setValidationErrors({ ...validationErrors, fiscalId: "" }), [
    requestor.fiscalId,
  ]);

  function handleFormSubmit(e) {
    e.preventDefault();

    let hasErrored = false;
    if (requestor.name.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          name: "Please insert a valid name",
        };
      });
      hasErrored = true;
    }

    if (requestor.description.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          description:
            "Please insert some description, so that donors can know you better",
        };
      });
      hasErrored = true;
    }

    if (requestor.fiscalId.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          fiscalId: `Please insert a valid ${
            requestor.category !== "No profit association"
              ? "VAT number"
              : "fiscal code"
          } so that we can correctly verify you`,
        };
      });
      hasErrored = true;
    }

    if (!hasErrored) {
      console.log("Submitted");
    }
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
              error={validationErrors.name}
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
              error={validationErrors.description}
            />
            <TextBox
              value={requestor.fiscalId}
              onChange={(e) => handleFieldChange("fiscalId", e.target.value)}
              label={`Your ${
                requestor.category !== "No profit association"
                  ? "VAT number"
                  : "fiscal code"
              }`}
              error={validationErrors.fiscalId}
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
