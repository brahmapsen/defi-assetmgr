import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Maker from "@makerdao/dai";
import { McdPlugin } from "@makerdao/dai-plugin-mcd";

export function useMakerDAO() {
  const { state, dispatch } = useStore();
  const account = state.account;

  useEffect(() => {
    async function getVaults(account) {
      let vaults = [];
      const maker = await Maker.create("browser", {
        plugins: [McdPlugin]
      });

      const manager = maker.service("mcd:cdpManager");
      const proxy = await maker.service("proxy").getProxyAddress(account);
      if (proxy) {
        const cdps = await manager.getCdpIds(proxy); // returns list of { id, ilk } objects
        for (const cdp of cdps) {
          const vault = await manager.getCdp(cdp.id);
          vaults.push(vault);
        }
      }
      dispatch({ type: "setMaker", maker: { vaults, proxy } });
    }

    if (account) {
      getVaults(account);
    }
  }, []);
}
