import { useEffect, useState } from "react";
import { useStore } from "../../store/store";

const realTokens = require("../config/realTokens.json");
const erc20ABI = require("../../config/abi/erc20");

export function useRealEstate(web3, account) {
  const { state, dispatch } = useStore();

  useEffect(() => {
    async function getRealEstate(web3, account) {
      let wei;
      let totalValue = 0;
      let totalAmount = 0;
      let properties = [];

      //REALT tokens
      for (const realToken of realTokens) {
        //ERC20 balance
        const realContract = new web3.eth.Contract(
          erc20ABI,
          realToken.address[state.network]
        );
        wei = await realContract.methods.balanceOf(account).call();

        const amount = parseFloat(wei) / 10 ** 18;
        totalValue = totalValue + amount * realToken.price;
        totalAmount = totalAmount + amount;
        properties.push({
          name: realToken.name,
          price: realToken.price,
          apy: realToken.apy,
          amount,
          link: realToken.link
        });
      }

      dispatch({
        type: "setRealEstate",
        realEstate: { totalAmount, totalValue, properties }
      });
    }

    if (state.web3 && state.account) {
      getRealEstate(state.web3, state.account);
    }
  }, [state.web3, state.account]);
}
