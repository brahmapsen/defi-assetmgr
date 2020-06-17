import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMakerDAO } from "./MakerDAO";
import { useStore } from "../../store/store";
import erc20ABI from "../config/ERC20";
import aDAIABI from "../config/aDAI";
import LendingPoolAddressesProviderABI from "../config/aaveAddressProvider";
import LendingPoolABI from "../config/aaveLendingPool";
import tokens from "../config/tokens";
import axios from "axios";

const COMPOUND_URL = "https://api.compound.finance/api/v2/account?addresses[]=";

export function useMakerDeposits() {
  const { state, dispatch } = useStore();
  useMakerDAO();
  const maker = state.maker;
  const web3 = state.web3;

  const initAssets = tokens.reduce((a, b) => ((a[b.symbol] = 0), a), {});

  useEffect(() => {
    async function getAssets() {
      let deposits = { totals: initAssets, savings: [] };

      let savings = [];
      let saving = {};
      let balance;
      let totalInterest;
      let apy;

      if (maker.vaults.length > 0) {
        //deposits of vaults
        for (const vault of maker.vaults) {
          deposits.totals[
            vault.collateralAmount.symbol
          ] = vault.collateralAmount.toNumber();
        }

        let wei;
        let ether;

        //get deposits from Compund

        const result = await axios.get(COMPOUND_URL + maker.proxy);

        if (result.data.accounts.length > 0) {
          for (const token of result.data.accounts[0].tokens) {
            //balance
            balance = parseFloat(token.supply_balance_underlying.value);
            totalInterest = parseFloat(
              token.lifetime_supply_interest_accrued.value
            );

            deposits.totals[token.symbol.substring(1)] = balance;

            //APY for compound
            const ctoken = new web3.eth.Contract(erc20ABI, token.address);
            const supplyRatePerBlock = await ctoken.methods
              .supplyRatePerBlock()
              .call();
            const ethMantissa = 1e18;
            const blocksPerDay = 4 * 60 * 24;
            const daysPerYear = 365;

            apy =
              (Math.pow(
                (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
                daysPerYear - 1
              ) -
                1) *
              100;

            //saving item
            saving = {
              token: token.symbol.substring(1),
              platform: "Compound",
              balance,
              apy,
              totalInterest
            };
            savings.push(saving);
          }
        }

        //aave aDAI
        wei = 0;
        const aDai = new web3.eth.Contract(
          aDAIABI,
          "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d"
        );

        //aDAI balance
        wei = await aDai.methods.balanceOf(maker.proxy).call();
        ether = Web3.utils.fromWei(wei, "ether");
        balance = parseFloat(ether);
        deposits.totals["DAI"] = deposits.totals["DAI"] + balance;

        //initial balance
        wei = await aDai.methods.principalBalanceOf(maker.proxy).call();
        ether = Web3.utils.fromWei(wei, "ether");
        totalInterest = balance - parseFloat(ether);

        //APY
        const lpAddressProviderAddress =
          "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8"; // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        const lpAddressProviderContract = new web3.eth.Contract(
          LendingPoolAddressesProviderABI,
          lpAddressProviderAddress
        );

        // Get the latest LendingPool contract address
        const lpAddress = await lpAddressProviderContract.methods
          .getLendingPool()
          .call();

        //lending pool contract
        const lendingPoolContract = new web3.eth.Contract(
          LendingPoolABI,
          lpAddress
        );

        //Get reserve date
        const aaveResult = await lendingPoolContract.methods
          .getReserveData("0x6B175474E89094C44Da98b954EedeAC495271d0F")
          .call();

        const aaveAPY = parseFloat(aaveResult.liquidityRate) / 1e25;

        //saving item
        saving = {
          token: "DAI",
          platform: "Aave",
          balance,
          apy: aaveAPY,
          totalInterest
        };
        savings.push(saving);
      }

      deposits.savings = savings;

      //set savings in global storage
      dispatch({ type: "setDeposits", deposits });
    }

    if (maker) {
      getAssets();
    }
  }, [maker]);
}
