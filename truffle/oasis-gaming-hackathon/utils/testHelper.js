const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const leftPad = require('left-pad');

//jsonrpc and id necessary for moving ahead of time
const jsonrpc = '2.0';
const id = 0;

//Referred: https://medium.com/coinmonks/testing-time-dependent-logic-in-ethereum-smart-contracts-1b24845c7f72
const send = (method, params = []) =>
  web3.currentProvider.send({ id, jsonrpc, method, params });

// Function that fast forwards the time in Ganache
const fastForwardGanache = async function (seconds) {
  await send('evm_increaseTime', [seconds]);
  await send('evm_mine');
}

// Function that is used to calculate the keccak256(abi.encodePacked(...args))
const getKeccak256Hash = function(...args) {
  let concatenatedArgs = getConcatenatedArgs(args);
  return web3.sha3(concatenatedArgs, { encoding: 'hex' });
};

// It is equivalent of abi.encodePacked()
const getConcatenatedArgs = function(args) {
  let concatenatedArgs;
  concatenatedArgs = args.map(element => {
    if (typeof element === 'string') {
      //Then element can be an address too, in that case, remove 0x from the address
      if (element.substring(0, 2) === '0x') {
        return element.slice(2);
      } else {
        return web3.toHex(element).slice(2);
      }
    }

    if (typeof element === 'number') {
      return leftPad(element.toString(16), 64, 0); //64 characters, 0: Pad with 0
    } else {
      return '';
    }
  });
  concatenatedArgs = concatenatedArgs.join('');
  return concatenatedArgs;
};

// Function to get latest block timestamp
const getLatestBlockTimestamp = async function() {
  let block = await web3.eth.getBlock('latest');
  return block.timestamp;
}

module.exports = {
  fastForwardGanache,
  getKeccak256Hash,
  getLatestBlockTimestamp
};
