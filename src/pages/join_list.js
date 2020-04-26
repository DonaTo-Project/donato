import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const Contract = require("@truffle/contract");

import Layout from "../components/Layout";
import TextBox from "../components/TextBox";
import TextArea from "../components/TextArea";
import SegmentedButton from "../components/SegmentedButton";
import Select from "../components/Select";
import Button from "../components/Button";

import DonatoContract from "../../build/contracts/Donato.json";

function JoinList() {
  const user = useSelector((state) => state.user);

  const [requestor, setRequestor] = useState({
    name: "",
    description: "",
    countryId: "",
    category: "SME",
    fiscalId: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    description: "",
    countryId: "",
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
  useEffect(() => setValidationErrors({ ...validationErrors, countryId: "" }), [
    requestor.countryId,
  ]);
  useEffect(() => setValidationErrors({ ...validationErrors, fiscalId: "" }), [
    requestor.fiscalId,
  ]);

  async function handleFormSubmit(e) {
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

    if (requestor.countryId.trim() === "") {
      setValidationErrors((validationErrors) => {
        return {
          ...validationErrors,
          countryId: `Please select a valid country`,
        };
      });
      hasErrored = true;
    }

    if (!hasErrored) {
      let Donato = Contract(DonatoContract);
      Donato.setProvider(window.web3.currentProvider);
      let DonatoInstance = await Donato.deployed();
      // .at(
      //   "0x290DcEB0ce348c02D6B96e092F21Abe7BdcF60D7"
      // );

      await DonatoInstance.sendApplication(
        requestor.name,
        requestor.category,
        requestor.description,
        requestor.countryId,
        requestor.fiscalId,
        { from: user.address }
      );

      console.log("Submitted");
    }
  }

  if (user.role === "receiver")
    return (
      <Layout>
        <div>You're already registered!</div>
      </Layout>
    );

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
          {user.address === "" ? (
            "First of all, please login!"
          ) : (
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
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                label="What do you do?"
                error={validationErrors.description}
              />
              <Select
                value={requestor.countryId}
                onChange={({ label, value }) => {
                  handleFieldChange("countryId", value);
                }}
                label="Your country"
                error={validationErrors.countryId}
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
              <Button type="submit" variant="primary">
                Submit application
              </Button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}

export default JoinList;
