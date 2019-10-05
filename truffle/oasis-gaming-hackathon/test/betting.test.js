const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const testHelpers = require('../utils/testHelper')
const bignumber = require('bignumber.js')
const Betting = artifacts.require('Betting');
const BetToken = artifacts.require('BetToken');
const Car = artifacts.require('Car');
const Driver = artifacts.require('Driver');

contract('Betting Test suite', (accounts) => {
    const COINBASE = accounts[0]
    const GASLIMIT = 8000000;
    const ERC20_OWNER = accounts[1]

    const DRIVER_ADDRESS = accounts[2]
    const CAR_ADDRESS = accounts[3]

    const TOKEN_NAME_CAR = 'CARTOKEN'
    const SYMBOL_CAR = 'CART'

    const TOKEN_NAME_DRIVER = 'DRIVERTOKEN'
    const SYMBOL_DRIVER = 'DRIT'

    const NAME = 'TESTBETTOKEN'
    const SYMBOL = 'TBETT'
    const DECIMALS = 18
    const AMOUNT = 10000000000000


    let carContractInstance, driverContractInstance, betTokenContractInstance, bettingContractInstance
    let driverId, carId
    let txObject
    before(async () => {
        carContractInstance = await Car.new(TOKEN_NAME_CAR, SYMBOL_CAR, {from: COINBASE, gas: GASLIMIT})
        driverContractInstance = await Driver.new(TOKEN_NAME_DRIVER, SYMBOL_DRIVER, {from: COINBASE, gas: GASLIMIT})
        betTokenContractInstance = await BetToken.new(NAME, SYMBOL, DECIMALS, ERC20_OWNER, AMOUNT, {from: COINBASE, gas: GASLIMIT})
        bettingContractInstance = await Betting.new({from: COINBASE, gas: GASLIMIT})
    })

    context('Generates Driver & Car Id', () => {
        it('should generate the driver id', async () => {
            txObject = await driverContractInstance.generateDriverId(
                DRIVER_ADDRESS, 
                testHelpers.getKeccak256Hash({name: 'Driver1', age: 20, mobile: 9545218954}),
                {from: COINBASE, gas: GASLIMIT}
            )
            driverId = await driverContractInstance.totalSupply.call() - 1
            assert.equal(txObject.receipt.status, true, 'Failed to generate driver id')
        })

        it('should generate the car id', async () => {
            txObject = await carContractInstance.generateCarId(
                CAR_ADDRESS, 
                testHelpers.getKeccak256Hash({driver: driverId, model: 'audi', color: 'red'}),
                {from: COINBASE, gas: GASLIMIT}
            )
            carId = await carContractInstance.totalSupply.call() - 1
            assert.equal(txObject.receipt.status, true, 'Failed to generate car id')
        })
    })

    context('Checks for succesful generation of Driver & Car Id', () => {
        let result, hash
        it('should check Driver ID is correct', async () => {
            hash = testHelpers.getKeccak256Hash({name: 'Driver1', age: 20, mobile: 9545218954})
            result = await driverContractInstance.tokenURI.call(driverId)
            assert.equal(hash, result, 'Failed to generate driver id')
        })

        it('should check Car ID is correct', async () => {
            hash = testHelpers.getKeccak256Hash({driver: driverId, model: 'audi', color: 'red'})
            result = await carContractInstance.tokenURI.call(carId)
            assert.equal(hash, result, 'Failed to generate car id')
        })
    })

    context('Generate 1 more Driver ID & Car ID', () => {
        it('generate Driver ID', async () => {
            txObject = await driverContractInstance.generateDriverId(
                DRIVER_ADDRESS, 
                testHelpers.getKeccak256Hash({name: 'Driver1', age: 20, mobile: 9545218954}),
                {from: COINBASE, gas: GASLIMIT}
            )
            driverId = await driverContractInstance.totalSupply.call() - 1
            assert.equal(txObject.receipt.status, true, 'Failed to generate driver id')
        })

        it('generate Car ID', async () => {
            txObject = await carContractInstance.generateCarId(
                CAR_ADDRESS, 
                testHelpers.getKeccak256Hash({driver: driverId, model: 'audi', color: 'red'}),
                {from: COINBASE, gas: GASLIMIT}
            )
            carId = await carContractInstance.totalSupply.call() - 1
            assert.equal(txObject.receipt.status, true, 'Failed to generate car id')
        })
    })

    context('acc1 bets 10 Eth on Car 1 & acc2 bets 20 Eth on Car 2', () => {
        context('bet', () => {
            it('bet 10 Eth on Car1 from acc1', async () => {
            txObject = await bettingContractInstance.bet(0, {from: accounts[1], gas: GASLIMIT, value: 10 * 10 **18})
            assert.equal(txObject.receipt.status, true, 'Bet failed.')
        })

            it('bet 20 Eth on Car2 from acc2', async () => {
                txObject = await bettingContractInstance.bet(1, {from: accounts[2], gas: GASLIMIT, value: 20 * 10 **18})
                assert.equal(txObject.receipt.status, true, 'Bet failed.')
            })
        })

        context('check whether bit was successful', () => {
            let result
            it('checks acc1"s bet for Car1 is 10 Eth', async () => {
                result = new bignumber (await bettingContractInstance.betAmount.call(accounts[1], 0))
                assert.equal(result.toNumber(), 10 * 10 ** 18, 'Bet failed')
            })

            it('checks acc2"s bet for Car2 is 20 Eth', async () => {
                result = new bignumber (await bettingContractInstance.betAmount.call(accounts[2], 1))
                assert.equal(result.toNumber(), 20 * 10 ** 18, 'Bet failed')
            })
        })

        context('finishRace', () => {
            it('finishRace with winner to be Car2', async() => {
                txObject = await bettingContractInstance.finishRace(1, {from: COINBASE, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Finish race failed.')
            })
        })

        context('withdraw', () => {
            let balance
            it('should withdraw for acc2', async () => {
                txObject = await bettingContractInstance.withdraw({from: accounts[2], gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Withdraw failed.')
            })

            it('should revert for acc1', async () => {
                txObject = await bettingContractInstance.withdraw({from: accounts[1], gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Withdraw failed.')
            })
        })
    })
})