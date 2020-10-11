# Defi Asset Manager

Manage portfolios of different asset classes on defi

## Install

Install node packages

`npm install`

## Test with local blockchain

First run a local blockchain with fork of the mainnet and deploy smart contract there.

The smart contract is in a different git repo. Please follow the instructions from https://github.com/hochbruj/portfolio-balancer.

Once you have deployed the smart contract on your local blockchain, copy the address into /src/wallet/hooks/Portfolio.js.

Import one of the funded accounts from local blochckain into MetaMask.
Copy private key from local chain into MetaMask.

Connect MetaMask to Localhost 8545.

Run App on localhost
`npm start`
