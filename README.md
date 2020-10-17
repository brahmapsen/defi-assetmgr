# Defi Asset Manager

Manage portfolios of different asset classes on defi

## Install

Install node packages

`npm install`

## Test with local blockchain

First run a fork of the mainnet on your local blockchain

`ganache-cli --fork https://mainnet.infura.io/v3/<YOUR_INFURA_PROJECT_ID> --i 999`

If you don't have an Ifura API key, here's how to get one: https://medium.com/jelly-market/how-to-get-infura-api-key-e7d552dd396f

Deploy PortfolioBalancer smart contract

`npx oz deploy`

Once you have deployed the smart contract on your local blockchain, copy the address into the REACT_APP_PORTFOLIO_ADDRESS environment variable in .env (see .env.example).

Import one of the funded accounts from local blochckain into MetaMask.
Copy private key from local chain into MetaMask.

Connect MetaMask to Localhost 8545.

Set environment variable to get token value using Chainlink Oracle contract for ETH,BTC,DAI
export REACT_APP_ETH_RPC=https://kovan.infura.io/v3/........

Run App on localhost
`npm start`
