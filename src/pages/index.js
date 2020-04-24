import Layout from "../components/layout";
import { useSelector } from "react-redux";
import { useState } from "react";

function Home(props) {
  const campaigns = useSelector((state) => state.campaigns);

  function redirectToPayment(address) {
    window.location.href = `https://buy-staging.moonpay.io?apiKey=${process.env.MOONPAY_KEY}&currencyCode=dai&walletAddress=${address}&redirectURL=http://localhost:3000`;
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="text-3xl">Campaigns</h1>
        {campaigns.map((campaign, i) => (
          <div className="flex justify-between w-full px-2 py-4 border-2 border-gray-200 rounded">
            <h2>{campaign.name}</h2>
            <button
              type="button"
              onClick={() => redirectToPayment(campaign.address)}
            >
              Donate
            </button>
          </div>
        ))}
      </div>
      {props.transactionId !== "" && props.transactionStatus !== "" && (
        <div className="absolute bottom-0 right-0 p-4 m-8 text-green-800 bg-green-200">
          Your donation went well!
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let { transactionId = "", transactionStatus = "" } = context.query;

  return { props: { transactionId, transactionStatus } };
}

export default Home;
