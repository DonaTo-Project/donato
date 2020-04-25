import Link from "next/link";
import { useState, useEffect } from "react";
import Box from "3box";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";

import { updateUser } from "../state/user/actions";

import adminAddresses from "../utils/adminAddresses";
import recipientsAddresses from "../utils/recipientsAddresses";

function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isExpanded, toggleExpansion] = useState(false);

  useEffect(
    () =>
      (async () => {
        let fm = new Fortmatic(process.env.FORTMATIC_KEY);
        window.web3 = new Web3(fm.getProvider());

        let isUserLoggedIn = await fm.user.isLoggedIn();
        if (isUserLoggedIn) {
          const address = await web3.eth.getCoinbase();
          const balance = await web3.eth.getBalance(address);

          // const provider = await Box.get3idConnectProvider();
          // const box = await Box.openBox(coinbase, provider);

          // const spaces = ["DonaTo"];
          // await box.auth(spaces, { address: coinbase });

          // console.log("Started syncing...");
          // await box.syncDone;

          // const nickname = await box.public.get("name");
          // console.log(nickname);

          await dispatch(updateUser({ address, balance }));
        }
      })(),
    []
  );

  async function changeUserAuthStatus(e) {
    e.preventDefault();

    try {
      let fm = new Fortmatic(process.env.FORTMATIC_KEY);
      window.web3 = new Web3(fm.getProvider());

      let isUserLoggedIn = await fm.user.isLoggedIn();
      if (!isUserLoggedIn) {
        const address = await web3.eth.getCoinbase();
        const balance = await web3.eth.getBalance(address);

        // const provider = await Box.get3idConnectProvider();
        // const box = await Box.openBox(coinbase, provider);

        // const spaces = ["DonaTo"];
        // await box.auth(spaces, { address: coinbase });

        // console.log("Started syncing...");
        // await box.syncDone;

        // const nickname = await box.public.get("name");
        // console.log(nickname);

        await dispatch(updateUser({ address, balance }));
      } else {
        await fm.user.logout();
        await dispatch(updateUser({ address: "", balance: 0 }));
      }
    } catch (err) {
      console.log("AAAAA");
      console.log(err);
    }
  }

  return (
    <header className="bg-teal-500">
      <div className="flex flex-wrap items-center justify-between max-w-4xl p-4 mx-auto md:flex-no-wrap md:p-8">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-xl font-bold text-white">DonaTo</a>
          </Link>
        </div>

        <button
          className="flex items-center block px-3 py-2 text-white border border-white rounded md:hidden"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        <ul
          className={`${
            isExpanded ? `block` : `hidden`
          } md:flex flex-col md:flex-row md:items-center md:justify-center text-sm w-full md:w-auto`}
        >
          {[
            { title: "Home", route: "/" },
            { title: "About", route: "/about" },
          ].map((navigationItem) => (
            <li className="mt-3 md:mt-0 md:ml-6" key={navigationItem.title}>
              <Link href={navigationItem.route}>
                <a className="block text-white">{navigationItem.title}</a>
              </Link>
            </li>
          ))}
          {!adminAddresses.includes(user.address) && (
            <li
              className="mt-3 md:mt-0 md:ml-6"
              key="Want to receive donations?"
            >
              <Link href="/join_list">
                <a className="block text-white">Want to receive donations?</a>
              </Link>
            </li>
          )}
          {adminAddresses.includes(user.address) && (
            <li className="mt-3 md:mt-0 md:ml-6" key="acceptOrg">
              <Link href="/accept_requests">
                <a className="block text-white">View requests</a>
              </Link>
            </li>
          )}
          {recipientsAddresses.includes(user.address) && (
            <li className="mt-3 md:mt-0 md:ml-6" key="dashboard">
              <Link href="/dashboard">
                <a className="block text-white">Your balance</a>
              </Link>
            </li>
          )}
          <li className="mt-3 md:mt-0 md:ml-6" key="login">
            <button onClick={changeUserAuthStatus} className="block text-white">
              {user.address === "" ? "Login" : "Logout"}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
