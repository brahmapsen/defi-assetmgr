import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import tokens from "../config/tokens";

export function useMakerDebts() {
  const { state, dispatch } = useStore();
  const [debts, setDebts] = useState(null);

  const maker = state.maker;

  const initAssets = tokens.reduce((a, b) => ((a[b.symbol] = 0), a), {});

  useEffect(() => {
    function getDebts() {
      let debtsObj = initAssets;
      //deposits of vaults
      for (const vault of maker.vaults) {
        debtsObj[vault.debtValue.symbol] = vault.debtValue.toNumber();
      }
      setDebts(debtsObj);
    }

    if (maker) {
      getDebts();
    }
  }, [maker]);

  return {
    debts
  };
}
