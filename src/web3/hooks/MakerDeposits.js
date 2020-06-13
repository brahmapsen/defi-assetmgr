import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMakerDAO } from "./MakerDAO";
import { useStore } from "../../store/store";
import erc20ABI from "../config/ERC20";
import tokens from "../config/tokens";

export function useMakerDeposits() {
  const { state } = useStore();
  useMakerDAO();
  const [deposits, setDeposits] = useState(null);

  const maker = state.maker;
  const web3 = state.web3;

  const initAssets = tokens.reduce((a, b) => ((a[b.symbol] = 0), a), {});

  useEffect(() => {
    async function getAssets() {
      let depositsObj = initAssets;

      if (maker.vaults.length > 0) {
        //deposits of vaults
        for (const vault of maker.vaults) {
          depositsObj[
            vault.collateralAmount.symbol
          ] = vault.collateralAmount.toNumber();
        }

        let wei;
        let ether;
        //compound cDAI 0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d
        const cDAI = new web3.eth.Contract(
          erc20ABI,
          "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643"
        );

        const exchangeRateCurrent = await cDAI.methods
          .exchangeRateCurrent()
          .call();
        const oneCTokenInUnderlying = exchangeRateCurrent / Math.pow(10, 36);
        wei = await cDAI.methods.balanceOf(maker.proxy).call();
        wei = wei * oneCTokenInUnderlying;
        depositsObj["DAI"] = parseFloat(wei);

        //aave aDAI
        let contract;
        wei = 0;
        contract = new web3.eth.Contract(
          erc20ABI,
          "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d"
        );
        wei = await contract.methods.balanceOf(maker.proxy).call();
        ether = Web3.utils.fromWei(wei, "ether");
        depositsObj["DAI"] = depositsObj["DAI"] + parseFloat(ether);
      }

      setDeposits(depositsObj);
    }

    if (maker) {
      getAssets();
    }
  }, [maker]);

  return {
    deposits
  };
}
