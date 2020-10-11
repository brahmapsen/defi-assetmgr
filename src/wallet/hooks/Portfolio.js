import { useEffect, useState } from "react";
import { useStore } from "../../store/store";

const tokens = require("../../config/tokens/tokens.json");
const portfolioBalancerABI = require("../config/abi/PortfolioBalancer.json");

//Replace with deployed address from local blockchain
const portfolioBalancerAddress = "0x19a434CA32F9e17CB09E73185760EB2c6b972B67";

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

        // const result = await web3.eth.sendTransaction({
        //   from: account,
        //   to: "0x41ed148cE6489c105963e2C038c1435962a05C94",
        //   value: 1000000000000000000
        // });

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
        console.log("Error", err);
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
