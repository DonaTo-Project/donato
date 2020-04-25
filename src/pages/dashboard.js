import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Layout from "../components/Layout";

function Dashboard() {
  const balance = useSelector((state) => state.user.balance);

  async function cashout() {}

  return (
    <Layout>
      <div className="flex flex-col">
        <h2 className="mb-3 text-xl font-bold">Your balance</h2>
        <p className="mb-6 font-mono text-xl">{balance} €</p>
        <button
          type="button"
          className="w-full p-2 text-white bg-purple-700 rounded-md sm:w-1/2 md:w-1/4 hover:bg-purple-600"
          onClick={cashout}
        >
          Cash out
        </button>
      </div>
    </Layout>
  );
}

export default Dashboard;
