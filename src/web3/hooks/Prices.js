import { useState, useEffect } from "react";
import { useStore } from "../../store/store";
import axios from "axios";
import tokens from "../config/tokens";

//coingecko URLS
const URL_BASE = "https://api.coingecko.com/api/v3/simple/price?ids=";
const URL_CURRENCIES = "&vs_currencies=usd";

//coingecko ids as string
let ids = tokens.map((x) => x.coingecko).join("%2C");

export function usePrices() {
  let prices = {};
  const { state, dispatch } = useStore();
  useEffect(() => {
    async function getPrices() {
      try {
        const result = await axios.get(URL_BASE + ids + URL_CURRENCIES);
        for (const token of tokens) {
          prices[token.symbol] = parseFloat(
            result.data[token.coingecko]["usd"]
          );
        }
        dispatch({ type: "setPrices", prices });
      } catch {
        console.log("Error loading coin prices");
      }
    }
    getPrices();
  }, []);
  return {
    prices,
  };
}
