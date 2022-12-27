# TACT wallet contract

This project has ready to use TACT compiler, typescript + jest with ton-contract-executor, example how to do tests.

```bash
npm install
# Build contract
yarn build
# Test contract
yarn test
# Deploy contract
export TESTNET='0' # Set TESTNET='1' if you want to deploy to testnet
yarn deploy
# Transfer all coins from deployed wallet to a given address
# Put here your mnemonic from the previous step
export MNEMONIC='suffer insane asthma tone system order menu vocal dove betray paper lawsuit drill earn paddle mom unable grit diamond glass hero zebra scare bunker'
# Address to receive coins
export RECEIVER_ADDRESS=''
yarn transfer
```

## Licence

MIT