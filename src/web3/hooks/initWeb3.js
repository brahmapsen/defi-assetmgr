import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Web3 from "web3"; // uses latest 1.x.x version
import Fortmatic from "fortmatic";
import { useBalances } from "./Balances";
import { useMakerDAO } from "./MakerDAO";

export function useInitWeb3() {
  const { state, dispatch } = useStore();
  const [wallet, setWallet] = useState(null);

  useBalances();
  useMakerDAO();

  let modals = state.modals;

  useEffect(() => {
    async function initWeb3(wallet) {
      let web3;
      let account = "";
      modals.connectionPending = true;
      dispatch({ type: "setWallet", wallet });
      dispatch({ type: "setModals", modals });
      switch (wallet) {
        //Metamask wallet
        case "MetaMask":
          if (window.ethereum) {
            console.log("Using modern web3 provider.");
            web3 = new Web3(window.ethereum);
            try {
              // Request account access if needed
              await window.ethereum.enable().then(wallets => {
                account = wallets[0];
              });
            } catch (error) {
              // User denied account access...
              console.log("User cancelled connect request. Error:", error);
            }
          }
          // Legacy dapp browsers, public wallet address always exposed
          else if (window.web3) {
            console.log("Legacy web3 provider. Try updating.");
            web3 = new Web3(window.web3.currentProvider);
          }
          // Non-dapp browsers...
          else {
            console.log(
              "Non-Ethereum browser detected. Need to install metamask"
            );
            //To do handle message to user
          }
          break;
        //Fortmatic wallet
        case "Fortmatic":
          // TODO: Step 2: Setup Developer API Key
          let fm = new Fortmatic("pk_test_2143334B2A521D2F", "kovan");
          web3 = new Web3(fm.getProvider());
          window.web3 = web3;
          let accounts = await fm.user.login();
          account = accounts[0];
          break;
      }
      dispatch({ type: "setAccount", account });

      //set network
      const networkId = await web3.eth.net.getId();
      let network;
      console.log("network", networkId);
      switch (networkId) {
        case 42:
          network = "kovan";
          break;
        default:
          network = "main";
      }
      dispatch({ type: "setNetwork", network });
      dispatch({ type: "setWeb3", web3 });

      modals.connectionPending = false;
      dispatch({ type: "setModals", modals });
    }
    if (wallet) {
      initWeb3(wallet);
    }
  }, [wallet]);

  return {
    setWallet
  };
}
