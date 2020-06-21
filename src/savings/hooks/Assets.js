import { useEffect } from "react";
import Web3 from "web3";
import { useStore } from "../../store/store";
import axios from "axios";

const erc20ABI = require("../../config/abi/erc20.json");
const tokens = require("../../config/tokens/tokens");

const {
  LendingPoolAddressesProviderABI,
  LendingPoolAddressesProviderContract
} = require("../config/aave/AddressProvider.json");
const { LendingPoolABI } = require("../config/aave/LendingPool.json");
const {
  aTokenABI,
  aDAIContract,
  DAIContract
} = require("../config/aave/aToken.json");

const COMPOUND_URL = "https://api.compound.finance/api/v2/account?addresses[]=";

export function useSavings() {
  const { state, dispatch } = useStore();
  const { web3, network, maker } = state;

  //set deposits balances for all tokens to 0
  let initDebts = tokens.reduce((a, b) => ((a[b.symbol] = 0), a), {});
  let initDeposits = tokens.reduce((a, b) => ((a[b.symbol] = 0), a), {});

  useEffect(() => {
    async function getAssets() {
      let deposits = { totals: initDeposits, savings: [] };
      let debts = { totals: initDebts };

      let savings = [];
      let saving = {};
      let balance;
      let totalInterest;
      let apy;
      let wei;
      let ether;

      if (maker.vaults.length > 0) {
        //deposits of maker vaults
        for (const vault of maker.vaults) {
          deposits.totals[
            vault.collateralAmount.symbol
          ] = vault.collateralAmount.toNumber();
        }

        //debts of maker vaults
        for (const vault of maker.vaults) {
          debts.totals[vault.debtValue.symbol] = vault.debtValue.toNumber();
        }

        //get savings inCompund

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
        const aDai = new web3.eth.Contract(aTokenABI, aDAIContract[network]);

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
        const lpAddressProviderContract = new web3.eth.Contract(
          LendingPoolAddressesProviderABI,
          LendingPoolAddressesProviderContract[network]
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

        const aaveResult = await lendingPoolContract.methods
          .getReserveData(DAIContract[network])
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

      //set sassets in global storage
      dispatch({ type: "setSavingAssets", savingAssets: { deposits, debts } });
    }

    if (maker) {
      getAssets();
    }
  }, [maker]);
}
