import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import Contract from "@truffle/contract";

import { fortmaticNetwork } from "../utils/config";

import { updateUser } from "../state/user/actions";
import DonatoContract from "../../build/contracts/Donato.json";

function Header() {
  const router = useRouter();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isExpanded, toggleExpansion] = useState(false);

  async function getUserAddressRoleAndCoinBalance() {
    const address = await window.web3.eth.getCoinbase();
    const balance = 0;

    let Donato = Contract(DonatoContract);
    Donato.setProvider(window.web3.currentProvider);
    const DonatoInstance = await Donato.deployed();

    const isAdmin = await DonatoInstance.isAdmin.call(address);

    let role = "user";
    if (isAdmin) role = "admin";
    else {
      try {
        await DonatoInstance.receiversContractAddresses.call(address);
        role = "receiver";
      } catch (err) {}
    }

    return { address, balance, role };
  }

  async function changeUserAuthStatus(e) {
    e.preventDefault();

    try {
      let fm = new Fortmatic(process.env.FORTMATIC_KEY, fortmaticNetwork);
      window.web3 = new Web3(fm.getProvider());

      let isUserLoggedIn = await fm.user.isLoggedIn();
      if (!isUserLoggedIn) {
        const { email } = await fm.user.getUser();
        const {
          address,
          balance,
          role,
        } = await getUserAddressRoleAndCoinBalance();
        await Axios.get(`/api/${address}/fund`);

        await dispatch(updateUser({ address, balance, role, email }));
      } else {
        await fm.user.logout();
        await dispatch(
          updateUser({ address: "", balance: 0, role: "user", email: "" })
        );
        router.push("/");
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
          {user.role === "user" && (
            <li
              className="mt-3 md:mt-0 md:ml-6"
              key="Want to receive donations?"
            >
              <Link href="/join_list">
                <a className="block text-white">Want to receive donations?</a>
              </Link>
            </li>
          )}
          {user.role === "admin" && (
            <li className="mt-3 md:mt-0 md:ml-6" key="acceptOrg">
              <Link href="/accept_requests">
                <a className="block text-white">View requests</a>
              </Link>
            </li>
          )}
          {user.role === "receiver" && (
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
