import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function Home(props) {
  const campaigns = useSelector((state) => state.campaigns);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isRedirecting) {
      setTimeout(() => {
        window.location.href = `https://buy-staging.moonpay.io?apiKey=${process.env.MOONPAY_KEY}&currencyCode=dai&walletAddress=${address}&enabledPaymentMethods=credit_debit_card,sepa_bank_transfer&redirectURL=http://localhost:3000`;
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
              <button
                type="button"
                className="p-2 rounded-md hover:bg-gray-200"
                onClick={() => redirectToPayment(campaign.address)}
              >
                Donate
              </button>
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
