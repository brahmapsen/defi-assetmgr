import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Web3 from "web3";
import tokens from "../config/tokens";
import erc20ABI from "../config/ERC20";

export function useBalances(web3, account) {
  const { state, dispatch } = useStore();
  let balances = {};

  useEffect(() => {
    async function getBalances(web3, account) {
      let wei;
      let ether;
      for (const token of tokens) {
        if (token.address === "0x") {
          //ETH balance
          wei = await web3.eth.getBalance(account);
        } else {
          //ERC20 balance
          let contract = new web3.eth.Contract(
            erc20ABI,
            token.address[state.network]
          );
          wei = await contract.methods.balanceOf(account).call();
        }
        ether = Web3.utils.fromWei(wei, "ether");
        balances[token.symbol] = parseFloat(ether);
      }
      dispatch({ type: "setBalances", balances });
    }

    if (state.web3 && state.account) {
      getBalances(state.web3, state.account);
    }
  }, [state.web3, state.account]);
}
