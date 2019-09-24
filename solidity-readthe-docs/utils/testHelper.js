const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

//jsonrpc and id necessary for moving ahead of time
const jsonrpc = '2.0';
const id = 0;

//Referred: https://medium.com/coinmonks/testing-time-dependent-logic-in-ethereum-smart-contracts-1b24845c7f72
const send = (method, params = []) =>
  web3.currentProvider.send({ id, jsonrpc, method, params });

async function fastForwardGanache(seconds) {
  await send('evm_increaseTime', [seconds]);
  await send('evm_mine');
}

module.exports = {
  fastForwardGanache
};
