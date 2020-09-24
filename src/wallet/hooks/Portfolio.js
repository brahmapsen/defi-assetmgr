import { useEffect, useState } from "react";
import { useStore } from "../../store/store";

const tokens = require("../../config/tokens/tokens.json");
const portfolioBalancerABI = require("../config/abi/PortfolioBalancer.json");
const portfolioBalancerAddress = "0xAced2FF60e1Cd311F649F0a187279daC868d0852";

const erc20ABI = require("../../config/abi/erc20.json");

export function usePortfolio(web3, account) {
  const { state, dispatch } = useStore();
  const [sendTx, setSendTx] = useState(null);
  const [rebalanced, setRebalanced] = useState(false);
  const [amounts, setAmounts] = useState("");

  useEffect(() => {
    async function rebalance(web3, account) {
      console.log("Amounts", sendTx);
      const totalEth = web3.utils.toWei(
        (sendTx["DAI"] + sendTx["PAXG"] + sendTx["WBTC"]).toString()
      );

      try {
        const portfolioContract = new web3.eth.Contract(
          portfolioBalancerABI,
          portfolioBalancerAddress
        );

        const result = await portfolioContract.methods
          .rebalance(
            web3.utils.toWei(sendTx["DAI"].toString()),
            "0",
            web3.utils.toWei(sendTx["WBTC"].toString()),
            "0",
            web3.utils.toWei(sendTx["PAXG"].toString()),
            "0"
          )
          .send({ from: account, value: totalEth, gas: 4000000 });
        console.log(result);

        //update balances to export in util function
        let balances = {};
        let wei;
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

          balances[token.symbol] = parseFloat(wei) / 10 ** token.decimals;
        }
        console.log("update balance after tx");
        dispatch({ type: "setBalances", balances });
      } catch (err) {
        console.log(err);
      }
    }

    if (state.web3 && state.account && sendTx) {
      rebalance(state.web3, state.account);
      setSendTx(null);
      setRebalanced(true);
    }
  }, [state.web3, state.account, sendTx]);

  return {
    setSendTx,
    setAmounts,
    rebalanced
  };
}
