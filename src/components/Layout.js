import { useState, useEffect } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import Contract from "@truffle/contract";

import { fortmaticNetwork } from "../utils/config";
import { updateUser } from "../state/user/actions";

import DonatoContract from "../../build/contracts/Donato.json";

import Header from "./Header";

function Layout(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showChildren, setShowChildren] = useState(false);

  async function getUserAddressRoleAndCoinBalance() {
    const address = await window.web3.eth.getCoinbase();
    const balance = 0;

    let Donato = Contract(DonatoContract);
    Donato.setProvider(window.web3.currentProvider);
    const DonatoInstance = await Donato.deployed();

    let role = "user";
    if (await DonatoInstance.isAdmin.call(address)) role = "admin";
    else {
      try {
        await DonatoInstance.receiversContractAddresses.call(address);
        role = "receiver";
      } catch (err) {}
    }

    return { address, balance, role };
  }

  useEffect(() => {
    (async () => {
      let fm = new Fortmatic(process.env.FORTMATIC_KEY, fortmaticNetwork);
      window.web3 = new Web3(fm.getProvider());

      let isUserLoggedIn = await fm.user.isLoggedIn();
      if (isUserLoggedIn) {
        const { email } = await fm.user.getUser();
        const {
          address,
          balance,
          role,
        } = await getUserAddressRoleAndCoinBalance();
        // await Axios.get(`/api/${address}/fund`);
        await dispatch(updateUser({ address, balance, role, email }));
      }

      setShowChildren(true);
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl p-4 mx-auto md:px-8 md:py-16">
        {showChildren ? props.children : "Please wait..."}
      </main>
    </div>
  );
}

export default Layout;
