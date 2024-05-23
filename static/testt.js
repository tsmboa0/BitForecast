const {ethers} = require('ethers');
const {Web3} = require('web3');

// const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/724975be56204e32904f40ad4a0deb30");
// const gasPrice = provider.getGasPrice();
// console.log("gas price is ",gasPrice);


// Replace with your provider URL (e.g., Infura, Alchemy, etc.)
const web3 = new Web3('https://polygon-mainnet.infura.io/v3/724975be56204e32904f40ad4a0deb30');

async function getGasPrice() {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        console.log('Gas Price in wei:', gasPrice);
        console.log('Gas Price in gwei:', web3.utils.fromWei(gasPrice, 'gwei'));
		const bnGas = parseInt((web3.utils.toNumber(gasPrice)*12)/10);
		console.log("afret multiplying, the result is ",bnGas);
		console.log(web3.utils.toBigInt(bnGas));
    } catch (error) {
        console.error('Error fetching gas price:', error);
    }
}

// Call the function to get the gas price
getGasPrice();