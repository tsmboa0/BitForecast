const {ethers} = require('ethers');
const axios = require("axios");
const dotenv = require("dotenv").config();
const url = require("url");
const redis = require("redis");
const Redis = require("ioredis");
const {Web3} = require('web3');
// const { resolve } = require('path');

require('events').EventEmitter.defaultMaxListeners = 15;

const Client = new Redis(process.env.REDISCLOUD_URL);
let web3;

web3 = new Web3('https://polygon-mainnet.infura.io/v3/724975be56204e32904f40ad4a0deb30');

// const Client = redis.createClient();

//Contract interaction
let provider;
let wallet;
let contract;
let provider2;
let provider3;
let wallet2;
let wallet3;
let contract2;
let contract3;

const privateKey = process.env.PRIVATEKEY;

const contractAdress="0x88b65350f05198f569c56b8ae1b62cea16e9b826";

const abi =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOperatorAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetBear",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetBull",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bullOdd",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bearOdd",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pool",
				"type": "uint256"
			}
		],
		"name": "Betodds",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "CancelRound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Claim",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "ContractPaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "ContractPaused_",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "ContractUnpaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "ContractUnpaused_",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pool",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "lockedprice",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "outcome",
				"type": "uint256"
			}
		],
		"name": "EndRound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ExecuteForced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minRatioPercents",
				"type": "uint256"
			}
		],
		"name": "HouseBetMinRatioUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "InjectFunds",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "LockAutomate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bullOdd",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bearOdd",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pool",
				"type": "uint256"
			}
		],
		"name": "LockRound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minBetAmount",
				"type": "uint256"
			}
		],
		"name": "MinBetAmountUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rewardRate",
				"type": "uint256"
			}
		],
		"name": "RewardRateUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "newInterval",
				"type": "uint32"
			}
		],
		"name": "RoundIntervalUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "roundTimestamp",
				"type": "uint32"
			}
		],
		"name": "StartRound",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "Bets",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "claimed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isbet",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "BlackListInsert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "BlackListRemove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "betOnBull",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "betOnBear",
				"type": "uint256"
			}
		],
		"name": "Execute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "betOnBull",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "betOnBear",
				"type": "uint256"
			}
		],
		"name": "ForceExecute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "FundsExtract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FundsInject",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "IsPaused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OwnershipRenounce",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "Parent",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "RewardUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "canceled",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "closed",
				"type": "bool"
			}
		],
		"name": "RoundCancel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			},
			{
				"internalType": "uint32",
				"name": "timestamp",
				"type": "uint32"
			}
		],
		"name": "RoundLock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "RoundStart",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newMinBetAmount",
				"type": "uint256"
			}
		],
		"name": "SetMinBetAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_operatorAddress",
				"type": "address"
			}
		],
		"name": "SetOperator",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "newRewardRate",
				"type": "uint8"
			}
		],
		"name": "SetRewardRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_newInterval",
				"type": "uint32"
			}
		],
		"name": "SetRoundInterval",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "UserBets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_Rounds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "bullAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bearAmount",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "lockprice",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "endprice",
				"type": "int256"
			},
			{
				"internalType": "uint32",
				"name": "startTimestamp",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "lockTimestamp",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "rewardsClaimable",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "wonOdd",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isbullwon",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isbearwon",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "istie",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "closed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "canceled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_houseInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "houseBetBull",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "houseBetBear",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentEpoch",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isParentSet",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lockedOnce",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minBetAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minimumRewardRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "operatorAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "referrals",
		"outputs": [
			{
				"internalType": "address",
				"name": "daughters",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "roundInterval",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startedOnce",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "referral_code",
				"type": "address"
			}
		],
		"name": "userBetBearAndSetParent",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "referral_code",
				"type": "address"
			}
		],
		"name": "userBetBullAndSetParent",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "epoch",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "position",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "claimed",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "result",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "closed",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "canceled",
						"type": "bool"
					}
				],
				"internalType": "struct BitForecast.History[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "user_BetBear",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "user_BetBull",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "user_claimRound",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


const bscNetwork = process.env.POLYGONNETWORK;
const polygonNetwork = process.env.POLYGONJSON;

provider = new ethers.WebSocketProvider(bscNetwork);
provider2 = new ethers.JsonRpcProvider(polygonNetwork);

wallet = new ethers.Wallet(privateKey, provider);
wallet2 = new ethers.Wallet(privateKey, provider2);

contract = new ethers.Contract(contractAdress, abi, wallet);
contract2 = new ethers.Contract(contractAdress, abi, wallet2);

let remainingTime;
let counterStartTime;
let isPaused = false;
let LockAutomateSignal;
let signalTimeout;
let _minHouseBetRatio=90;
let blockStartTime;
let endTime;
let nextEpoch;
let bPrice;
let Price;
let wonOdd;
let rewardsClaimable;
let whoWon;
let betOnBull;
let betOnBear;
let timestamp;
let ConfirmationId;
let nonce;
let currentPricePool;
let previousBullOdd;
let previousBearOdd;
let _BullAmount;
let _BearAmount;
let lockedprice;
let isNeuralized=false;
let restartId;


getReload();

async function reConnectWsProvider(){
	isNeuralized = true;
    reActivateListeners();
    console.log("Closing the connection to webSocketProvider...");

    // Close the existing WebSocket connection and wait for it to close
    await provider.websocket.close();
        
    console.warn("Reopening socket...");
        
    // Reinitialize the provider, wallet, and contract
    provider = new ethers.WebSocketProvider(bscNetwork);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAdress, abi, wallet);

    console.log(await provider.getBlockNumber());
        
    const tx = await contract.isParentSet("0x4FC2988B2Fbd411767d08ef8768dB77e6A46DDfF");
    console.log("Parent is", tx);
        
    isNeuralized = false;
    reActivateListeners();

    console.log("Waiting 2.5s to resolve reConnectWsProvider...");
        
    // Wait for 2.5 seconds before resolving
    await new Promise(resolve => setTimeout(resolve, 2500));
        
    console.log("Reconnection complete.");
}

Client.on('connect', function() {
    console.log('Connected to Redis server');
});

provider.websocket.on('open', async()=>{
	console.log('worker connected to webscocket provider..');
});

provider.websocket.on('error', async()=>{
	console.warn("wss errored..");
	// reConnectWsProvider()
});

provider.websocket.on('close', async()=>{
	console.warn("worker disconnected from websocketprovider.. attempting to reconnect...");
	// reConnectWsProvider();
})

async function StartRoundW(data) {
	console.log("A new Round Just started "+data[0]);
	console.log("Round Timestamp is "+data[1]);
	console.log((data[1].toString()));

	//Post Execute settings
	clearTimeout(ConfirmationId);
	ConfirmationId = null;
	console.log("ConfirmationId cleared..");
	clearTimeout(restartId);
	restartId = null;
	console.log("restart cleared...");
	counterStartTime = new Date().getTime();
	remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);
	blockStartTime = parseInt(data[1].toString());
	endTime = (parseInt(data[1].toString())*1000 +(304000));
	console.log("endtime done "+endTime);
	//push to redis
	await Client.set("counterStartTime", counterStartTime);
	console.log("counterStartTime set for new round...");
	console.log("A new round has started at time "+endTime);
	
	//set values to redis
	await Client.hset("StartRound", {
		'endTime': endTime,
		'nextEpoch': nextEpoch,
		'blockStartTime': blockStartTime
	});
};

async function LockAutomateW() {
	console.log("Round Automate Emitted");
	remainingTime = 305000;
	getSignal();
	await Client.set("LockAutomateSignal", 'true');
}

async function ExecuteForcedW() {
	console.log("Force Execution signal received...");
	await Client.set("LockAutomateSignal", 'true');
	resetForced();
};

// async function reActivateListeners(){
// 	if(!isNeuralized){
// 		const eventPromises = [
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			})
// 		];

// 		await Promise.all(eventPromises);
// 	}else{
// 		console.log("Neutralize is false..");
// 	}

// 	console.log("exiting reActivateListners...");
// }

// reActivateListeners();



async function getReload(){
	// await Client.connect();
	// await Client.FLUSHALL();
	// await Client.flushdb();
	// console.log("all info cleared..");

	console.log("connected to redis...");

	const start_round = await Client.hgetall("StartRound");
	console.log("StartRound epoch is :"+start_round.nextEpoch);
	endTime = start_round.endTime;
	const block_start = start_round.blockStartTime;
	nextEpoch = start_round.nextEpoch;

    const lock_Automate = await Client.get("LockAutomateSignal");
	LockAutomateSignal = lock_Automate;
	console.log("Lockautomate Signal is :"+LockAutomateSignal);
	blockStartTime = parseInt(block_start);
	console.log("blockStartTime is :"+block_start);
	if(LockAutomateSignal==='true'){
		const counter_start = await Client.get("counterStartTime");
		counterStartTime = counter_start;
		console.log("counterStart is :"+counterStartTime);
		remainingTime = 300000 - ((new Date().getTime())- parseInt(counterStartTime));
		console.log("the Remaining time is :"+remainingTime);
		if(remainingTime===0){
			console.log("remaining Time less than zero, calling the getSignal0 function...");
			verifyTime();
		}else if(remainingTime>0){
			console.log("There is a remaining Time, calling the getSignal function...");
			getSignal();
		}else if(remainingTime<0){

			console.log("Less than zero, calling force Execute twice...");
			console.log("Starting First Force Execute...");
			await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
			.then(async(response) => {
				// Extract and use the price from the response
				console.log("price stage passed.")
				const _bPrice = response.data.price;
				console.log('BTC/USDT Price:', ethers.parseUnits(_bPrice.toString(), 18));
			
				// Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
				const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
				const num1 = randomNumber1;
				const num2 = randomNumber2;
				console.log(num1, num2);
				const _timestamp= Math.floor(new Date().getTime()/1000);
				console.log("timestamp is "+timestamp);
				const _betOnBull= ethers.parseUnits(num1.toString(), 18);
				console.log("BetBull is "+_betOnBull);
				const _betOnBear= ethers.parseUnits(num2.toString(), 18);
				console.log("BetBear is "+_betOnBear);
				const _Price = ethers.parseUnits(_bPrice.toString(), 18);
				console.log("the price is "+_Price);
				console.log(_betOnBull, _betOnBear);

				//increase gasPrice
				const gasPrice = await web3.eth.getGasPrice();
				console.log("gasPrice is ",gasPrice);
				const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
				console.log("increased gas is ",increasedGasPrice);

			
				//write to the blockchain.
				try{
					const tx = await contract2.ForceExecute(_Price, _timestamp, _betOnBull, _betOnBear, {gasPrice:increasedGasPrice});//look into this line and complete it.
					console.log("Force Execute completed from smart contract...");
					// Wrap both promises in an array
					const promises = [
						new Promise((resolve, reject) => {
							contract.once("ExecuteForced", async(event)=>{
								console.log("Force Execution signal received...");
								resolve();
							});
						}),
						tx.wait()
					];

					// Wait for both promises to resolve
					await Promise.all(promises);

					console.log("Fininshed first force Execute, calling the second one");
					forceExecute()
				}
				catch(e){
					console.log(e);
				};
				})
			.catch((error) => {
				console.error('Error:', error.message);
			});

			async function forceExecute(){
				console.log("Starting Second forceExecute...");
				await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
				.then(async(response) => {
				// Extract and use the price from the response
				console.log("price stage passed.")
				const _bPrice = response.data.price;
				console.log('BTC/USDT Price:', ethers.parseUnits(_bPrice.toString(), 18));
			
				// Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
				const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
				const num1 = randomNumber1;
				const num2 = randomNumber2;
				console.log(num1, num2);
				const _timestamp= Math.floor(new Date().getTime()/1000);
				console.log("timestamp is "+timestamp);
				const _betOnBull= ethers.parseUnits(num1.toString(), 18);
				console.log("BetBull is "+_betOnBull);
				const _betOnBear= ethers.parseUnits(num2.toString(), 18);
				console.log("BetBear is "+_betOnBear);
				const _Price = ethers.parseUnits(_bPrice.toString(), 18);
				console.log("the price is "+_Price);
				console.log(_betOnBull, _betOnBear);

				//increase gasPrice
				const gasPrice = await web3.eth.getGasPrice();
				console.log("gasPrice is ",gasPrice);
				const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
				console.log("increased gas is ",increasedGasPrice);

			
				//write to the blockchain.
				try{
					const tx = await contract2.ForceExecute(_Price, _timestamp, _betOnBull, _betOnBear, {gasPrice:increasedGasPrice});//look into this line and complete it.
					console.log("Force Execute completed from smart contract...");
					// Wrap both promises in an array
					const promises = [
						new Promise((resolve, reject) => {
							contract.once("ExecuteForced", async(event)=>{
								console.log("Force Execution signal received...");
								resolve();
							});
						}),
						tx.wait()
					];

					// Wait for both promises to resolve
					await Promise.all(promises);

					console.log("Fininshed secons force Execute");

					io.emit("ForcedExecute", true);
				}
				catch(e){
					console.log(e);
				};
				})
				.catch((error) => {
					console.error('Error:', error.message);
				});
			}

		}else{
			console.log("This shoud never be reached during operation...");
		}
	};
}


function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generateValidRandomPair(minRatio, maxRatio) {
    const aa = Math.random();
    if(aa > 0.5){
        const betBear = getRandomNumber(2500, 5000); // Assume any random value for betBear between 1 and 100
        const betBull = betBear * getRandomNumber(minRatio, maxRatio);
    
        return [betBull, betBear];
    }else{
        const betBull = getRandomNumber(2500, 5000); // Assume any random value for betBear between 1 and 100
        const betBear = betBull * getRandomNumber(minRatio, maxRatio);
    
        return [betBull, betBear];
    }
}


//cron operation. Calls Execute function every 5 minutes.
function getSignal(){
    console.log("Inside the getSignal... waiting for the next 5 mins to launch VerifyTime..");

    setTimeout(()=>{
        console.log("Inside the first setTimeout... launching verifyTime..");
        verifyTime();
        console.log("verifyTime called..");
    }, remainingTime);
}

async function verifyTime(){
	console.log("inside verify time...");
	const time_now = Math.floor(new Date().getTime()/1000);
	console.log("time_now is : "+time_now);
	const end_time = parseInt(blockStartTime + 300);
	console.log("start time is : "+blockStartTime);
	console.log("end time is : "+end_time);
	try{
		const blockNumber = await provider2.getBlockNumber();
		const block = await provider2.getBlock(blockNumber);
		const block_time = parseInt(block.timestamp);
		console.log("block time is : "+block_time);

		if(block_time > (end_time)){
			console.log("Requirements satisfied, calling execute function...");
			Execute();
			console.log("Execute1() called...");
			// restartAndExecute();
		}else{
			console.log("requirements not met, trying again...");
			setTimeout( ()=>{
				verifyTime();
			},5000)
		}

	}catch(e){
		console.log(e);
	}
}

async function resetContract23(){
	console.log("closing provider2 and 3...");
	console.log("both providers closed..");
	provider2=null;
	provider3=null;
	web3=null;
	provider2 = new ethers.JsonRpcProvider(polygonNetwork);
	web3 = new Web3('https://polygon-mainnet.infura.io/v3/724975be56204e32904f40ad4a0deb30');
	wallet2 = new ethers.Wallet(privateKey, provider2);
	contract2 = new ethers.Contract(contractAdress, abi, wallet2);
	console.log("both providers opened and parameters set...calling verify Time now");
	verifyTime();
}

async function resetForced(){
    console.log("inside reset forced function");
	new Promise(async(resolve)=>{
		console.log("inside reset promise...");
		counterStartTime = new Date().getTime();
		console.log("reset counterstart time set...");
		//push to redis
	    await Client.set("counterStartTime", counterStartTime);
		console.log("reset counter start saved to redis...");
		remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);
		console.log(" reset remaining time is :"+remainingTime);
		resolve();
		console.log("reset resolved...");
	})
	.then(()=>{
		getSignal();
		console.log("get Signal called.");
	})
    .catch((e)=>{
		console.log(e);
	})
}

async function Execute(){

    console.log("Using Execute1 to call the contract..");
    
    if(isPaused===false){
        console.log("isPaused test passed")
        //get binance price
        await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        .then(async(response) => {
        // Extract and use the price from the response
        console.log("price stage passed.")
        bPrice = response.data.price;
        console.log('BTC/USDT Price:', ethers.parseUnits(bPrice.toString(), 18));

		//Reconnect wsProvider
		// await reConnectWsProvider();
		// console.log("wsProvider reconnected..");
    
        // Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
        const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
        const num1 = randomNumber1;
        const num2 = randomNumber2;
        console.log(num1, num2);
        timestamp= Math.floor(new Date().getTime()/1000);
        console.log("timestamp is "+timestamp);
        betOnBull= ethers.parseUnits(num1.toString(), 18);
        console.log("BetBull is "+betOnBull);
        betOnBear= ethers.parseUnits(num2.toString(), 18);
        console.log("BetBear is "+betOnBear);
        Price = ethers.parseUnits(bPrice.toString(), 18);
        console.log("the price is "+Price);
        console.log(betOnBull, betOnBear);

		//Perform Maths Operations to calcualte for wonOdd, rewardsClaimable and whowon.
		const params = await Client.hgetall('LockRound');
		previousBullOdd = params.previousBullOdd;
		previousBearOdd = params.previousBearOdd;
		lockedprice = params.lockedprice;
		const BullAmount = params.BullAmount;
		const BearAmount = params.BearAmount;

		// if(bPrice > lockedprice){
		// 	wonOdd = ethers.parseUnits(previousBullOdd.toString(), 18);
		// 	console.log("won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BullAmount * 0.94 * previousBullOdd)).toString(), 18);
		// 	console.log("rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 1
		// 	console.log("who won is: ",whoWon);

		// }else if(bPrice < lockedprice){
		// 	wonOdd = ethers.parseUnits(previousBearOdd.toString(), 18);
		// 	console.log("won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BearAmount * 0.94 * previousBearOdd)).toString(), 18);
		// 	console.log("rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 2
		// 	console.log("who won is: ",whoWon);

		// }else if(bPrice == lockedprice){
		// 	wonOdd = 1
		// 	console.log("won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BullAmount + BearAmount)).toString(), 18);
		// 	console.log("rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 3
		// 	console.log("who won is: ",whoWon);
		// }

		//increase gasPrice
		const gasPrice = await web3.eth.getGasPrice();
		console.log("gasPrice is ",gasPrice);
		const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
		console.log("increased gas is ",increasedGasPrice);

    
        //write to the blockchain.
        try{
			const tx = await contract2.Execute(Price, timestamp, betOnBull, betOnBear,{gasPrice:increasedGasPrice});//look into this line and complete it.
			console.log("Execute completed from smart contract...");
			nonce = tx.nonce;
			console.log("The execute nonce is ",tx.nonce);
			TxConfirmation();
            // Wrap both promises in an array
            const promises = [
                tx.wait()
            ];

            // Wait for both promises to resolve
            await Promise.all(promises);
			getSignal();
            console.log("Get signal function called again...");
          }
        catch(e){
            console.log(e);
        };
     })
      .catch((error) => {
        console.error('Error:', error.message);
      });
    
      console.log("The end!");
    }else{
        console.log("isPaused is True");
    }    
        
}

async function restartAndExecute(){
	console.log("Waiting for 60s to restart and force execute if startRound signal is not received..");

	restartId = setTimeout(async() => {
		console.log("60s elepsed and startRound event not recieved.. proceeding to restart...");
		const HEROKU_API_KEY = 'HRKU-a7c87b3d-2fb2-4dc8-9073-211aa196bcb1'; // Replace with your Heroku API key
		const APP_NAME = 'BitForecast'; // Replace with your Heroku app name
		try {
			const response = await axios.delete(
				`https://api.heroku.com/apps/${APP_NAME}/dynos`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/vnd.heroku+json; version=3',
						'Authorization': `Bearer ${HEROKU_API_KEY}`,
					},
				}
			);
			console.log('Dyno restarted:', response.data);
		} catch (error) {
			console.error('Error restarting dyno:', error.response ? error.response.data : error.message);
		}

	}, 60000);
}

async function TxConfirmation(){
	console.log("Waiting for 30s before calling ReExecute function...");

	ConfirmationId = setTimeout(()=>{
		//code ..
		console.log("30s elapsed and no startRound signal gotten. Proceeding to ReExecute...");
		ReExecute();
	},30000);
}

async function ReExecute(){
	console.log("ReCalling the Execute function now...");
	const gasPrice = await web3.eth.getGasPrice();
	console.log("gasPrice is ",gasPrice);
	const increasedGasPrice = web3.utils.toBigInt(parseInt(web3.utils.toNumber(gasPrice)*2));
	console.log("increased gas is ",increasedGasPrice);
	try{
		const tx = await contract2.Execute(Price, timestamp, betOnBull, betOnBear, {nonce:nonce, gasPrice:increasedGasPrice});//look into this line and complete it.
		console.log("ReExecute completed......");
		nonce = tx.nonce;
		console.log("the reexecute nonce is ", tx.nonce);
		TxConfirmation();
		// Wrap both promises in an array
		const promises = [
			new Promise((resolve, reject) => {
				contract.once("StartRound", async(epoch, roundTimestamp, event) => {
					console.log("StartRound event received....");
					clearTimeout(ConfirmationId);
					ConfirmationId = null;
					console.log("ConfirmationId cleared..");

					counterStartTime = new Date().getTime();
					remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);

					blockStartTime = parseInt(roundTimestamp.toString());
					endTime = (parseInt(roundTimestamp.toString())*1000 +(304000));
					console.log("endtime done "+endTime);
					//push to redis
					await Client.set("counterStartTime", counterStartTime);
					console.log("counterStartTime set for new round...");
					resolve();
				});
			}),
			tx.wait()
		];

		// Wait for both promises to resolve
		await Promise.all(promises);
		getSignal();
		console.log("Get signal function called again...");
	  }
	catch(e){
		console.log(e);
		// console.log("ReExecute failed.. retrying in 10s");
		// setTimeout(async() => {
			// ReExecute()
		// }, 10000);
	};
}

// async function restartDyno(){
// 	console.log("began Journey to 1hr30minshrs restart..");

// 	setTimeout(async() => {
// 		const HEROKU_API_KEY = 'HRKU-da348822-e1e3-47a7-a194-df47114d04e8'; // Replace with your Heroku API key
// 		const APP_NAME = 'bitforecast-xyz'; // Replace with your Heroku app name
// 		const counter_start1 = await Client.get("counterStartTime1");
// 		const remainingTime1 =300000 - ((new Date().getTime())- parseInt(counter_start1));
	
// 		if(remainingTime>15000 && remainingTime1>15000){
// 			console.log("restarting dyno...");
// 				try {
// 					const response = await axios.delete(
// 						`https://api.heroku.com/apps/${APP_NAME}/dynos`,
// 						{
// 							headers: {
// 								'Content-Type': 'application/json',
// 								'Accept': 'application/vnd.heroku+json; version=3',
// 								'Authorization': `Bearer ${HEROKU_API_KEY}`,
// 							},
// 						}
// 					);
// 					console.log('Dyno restarted:', response.data);
// 				} catch (error) {
// 					console.error('Error restarting dyno:', error.response ? error.response.data : error.message);
// 				}
// 		}else{
// 			console.log("remainingTime less than 15s... retrying in the next 15s..");
// 			setTimeout(async() => {
// 				console.log("restarting dyno...");
// 				try {
// 					const response = await axios.delete(
// 						`https://api.heroku.com/apps/${APP_NAME}/dynos`,
// 						{
// 							headers: {
// 								'Content-Type': 'application/json',
// 								'Accept': 'application/vnd.heroku+json; version=3',
// 								'Authorization': `Bearer ${HEROKU_API_KEY}`,
// 							},
// 						}
// 					);
// 					console.log('Dyno restarted:', response.data);
// 				} catch (error) {
// 					console.error('Error restarting dyno:', error.response ? error.response.data : error.message);
// 				}
// 			}, 20000);
// 		}
// 	}, 7200000);

// }

// restartDyno();

console.log("Worker Started...");
module.exports = {
	StartRoundW,
	LockAutomateW,
	ExecuteForcedW,
  };
