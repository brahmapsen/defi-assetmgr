import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import axios from "axios";

const TX_URL_1 =
  "https://api.etherscan.io/api?module=account&action=txlist&address=";
const TX_URL_2 =
  "&startblock=0&endblock=99999999&sort=asc&apikey=UQMDG5738X215YQQY4QK8S7N3D4YGIB65X";

const TOKEN_TX_URL =
  "https://api.etherscan.io/api?module=account&action=tokentx&address=";

export function useTransactions() {
  const { state, dispatch } = useStore();
  useEffect(() => {
    async function getTransactions() {
      const txResult = await axios.get(TX_URL_1 + state.account + TX_URL_2);
      const txs = txResult.data.result;

      const tokenTxResult = await axios.get(TOKEN_TX_URL + state.account);
      const tokenTxs = tokenTxResult.data.result;
      dispatch({ type: "setTxs", txs: { all: txs, token: tokenTxs } });
    }
    if (state.account) {
      getTransactions(state.web3, state.account);
    }
  }, [state.account]);
}
