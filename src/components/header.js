import Link from "next/link";
import { useState } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";

import { updateUser } from "../state/user/actions";

function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isExpanded, toggleExpansion] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    let fm = new Fortmatic(process.env.FORTMATIC_KEY);
    web3 = new Web3(fm.getProvider());

    let isUserLoggedIn = await fm.user.isLoggedIn();
    console.log(isUserLoggedIn); // false

    const coinbase = await web3.eth.getCoinbase();

    await dispatch(updateUser({ address: coinbase }));
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
          <li className="mt-3 md:mt-0 md:ml-6" key="login">
            <button onClick={handleLogin} className="block text-white">
              {user.address === "" ? "Login" : "Logout"}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
