// SVM Worker.....

const express = require('express');
const {ethers} = require('ethers');
const axios = require("axios");
const dotenv = require("dotenv").config();
const url = require("url");
const redis = require("redis");
const Redis = require("ioredis");
const {Web3} = require('web3');
const { Server } = require("socket.io");
const http = require("http");
// const { resolve } = require('path');

require('events').EventEmitter.defaultMaxListeners = 15;

const app = express();

const Client = new Redis(process.env.REDISCLOUD_URL);
let web3;

web3 = new Web3('https://rpc.stratovm.io');

//Socket
const server = http.createServer(app);
const io = new Server(server);

// const Client = redis.createClient();

let provider;
let provider_svm;
let wallet;
let wallet2;
let contract;
let contract2;

const privateKey = process.env.PRIVATEKEY;

// SVM Contract Information
const contractAdress="0x6131D6D4E610260b2C0F41A0513D81D0605cC86f";
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

const SVMNETWORK = process.env.SVMNETWORK;
const svmJSON = process.env.SVMJSON;
provider = new ethers.WebSocketProvider(SVMNETWORK);
provider_svm = new ethers.JsonRpcProvider(svmJSON);
wallet = new ethers.Wallet(privateKey, provider);
wallet2 = new ethers.Wallet(privateKey, provider_svm);
contract = new ethers.Contract(contractAdress, abi, wallet);
contract2 = new ethers.Contract(contractAdress, abi, wallet2);
// SVM Cotract info ends

// SVM Detials
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

// async function connectRedis(){
	// await Client.connect();
// }

// connectRedis();

getReload();

async function reConnectWsProvider(){
	isNeuralized = true;
    reActivateListeners();
    console.log(" SVM Closing the SVM connection to webSocketProvider...");

    // Close the existing WebSocket connection and wait for it to close
    await provider.websocket.close();
        
    console.warn(" SVM Reopening SVM socket...");
        
    // Reinitialize the provider, wallet, and contract
    provider = new ethers.WebSocketProvider(SVMNETWORK);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAdress, abi, wallet);

    console.log(await provider.getBlockNumber());
        
    const tx = await contract.isParentSet("0x4FC2988B2Fbd411767d08ef8768dB77e6A46DDfF");
    console.log(" SVM Parent is", tx);
        
    isNeuralized = false;
    reActivateListeners();

    console.log(" SVM Waiting 2.5s to resolve reConnectWsProvider...");
        
    // Wait for 2.5 seconds before resolving
    await new Promise(resolve => setTimeout(resolve, 2500));
        
    console.log(" SVM Reconnection complete.");
}

Client.on('connect', function() {
    console.log(' SVM Connected to Redis server');
});

provider.websocket.on('open', async()=>{
	console.log(' SVM worker connected to webscocket provider..');
});

provider.websocket.on('error', async()=>{
	console.warn(" SVM wss errored..");
	// reConnectWsProvider()
});

provider.websocket.on('close', async()=>{
	console.warn(" SVM worker disconnected from websocketprovider.. attempting to reconnect...");
	reConnectWsProvider();
})

async function reActivateListeners(){
	if(!isNeuralized){
		const eventPromises = [
			new Promise((resolve, reject) => {
				contract.on("StartRound", async(epoch, roundTimestamp, event)=>{
					console.log(" SVM A new Round Just started "+epoch);
					console.log(" SVM Round Timestamp is "+roundTimestamp);
					console.log((roundTimestamp.toString()));
					blockStartTime = parseInt(roundTimestamp.toString());
					endTime = (parseInt(roundTimestamp.toString())*1000 +(304000));
					console.log(" SVM endtime done "+endTime);
					// nextEpoch = parseInt(epoch.toString());
					console.log(" SVM nextEpoch Passed.");
					console.log(" SVM A new round has started at time "+endTime);
					
					//set values to redis
					await Client.hset("StartRound1", {
						'endTime': endTime,
						'nextEpoch': nextEpoch,
						'blockStartTime': blockStartTime
					});
				});
			}),
			new Promise((resolve, reject) => {
				contract.on("LockAutomate", async(event)=>{
					console.log(" SVM Round Automate Emitted");
					remainingTime = 305000;
					getSignal();
					await Client.set("LockAutomateSignal1", 'true');
				})
			}),
			new Promise((resolve, reject) => {
				contract.on("ExecuteForced", async(event)=>{
					console.log(" SVM Force Execution signal received...");
					await Client.set("LockAutomateSignal1", 'true');
					resetForced();
				});
			})
		];

		await Promise.all(eventPromises);
	}else{
		console.log(" SVM Neutralize is false..");
	}

	console.log(" SVM exiting reActivateListners...");
}

reActivateListeners();



async function getReload(){
	// await Client.connect();
	// await Client.FLUSHALL();
	// await Client.flushdb();
	// console.log(" SVM all info cleared..");

	console.log(" SVM connected to redis...");

	const start_round = await Client.hgetall("StartRound1");
	console.log(" SVM StartRound epoch is :"+start_round.nextEpoch);
	endTime = start_round.endTime;
	const block_start = start_round.blockStartTime;
	nextEpoch = start_round.nextEpoch;

    const lock_Automate = await Client.get("LockAutomateSignal1");
	LockAutomateSignal = lock_Automate;
	console.log(" SVM Lockautomate Signal is :"+LockAutomateSignal);
	blockStartTime = parseInt(block_start);
	console.log(" SVM blockStartTime is :"+block_start);
	if(LockAutomateSignal==='true'){
		const counter_start = await Client.get("counterStartTime1");
		counterStartTime = counter_start;
		console.log(" SVM counterStart is :"+counterStartTime);
		remainingTime = 300000 - ((new Date().getTime())- parseInt(counterStartTime));
		console.log(" SVM the Remaining time is :"+remainingTime);
		if(remainingTime===0){
			console.log(" SVM remaining Time less than zero, calling the getSignal0 function...");
			verifyTime();
		}else if(remainingTime>0){
			console.log(" SVM There is a remaining Time, calling the getSignal function...");
			getSignal();
		}else if(remainingTime<0){

			console.log(" SVM Less than zero, calling force Execute twice...");
			console.log(" SVM Starting First Force Execute...");
			await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
			.then(async(response) => {
				// Extract and use the price from the response
				console.log(" SVM price stage passed.")
				const _bPrice = response.data.price;
				console.log(' SVM BTC/USDT Price:', ethers.parseUnits(_bPrice.toString(), 18));
			
				// Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
				const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
				const num1 = randomNumber1;
				const num2 = randomNumber2;
				console.log(num1, num2);
				const _timestamp= Math.floor(new Date().getTime()/1000);
				console.log(" SVM timestamp is "+timestamp);
				const _betOnBull= ethers.parseUnits(num1.toString(), 18);
				console.log(" SVM BetBull is "+_betOnBull);
				const _betOnBear= ethers.parseUnits(num2.toString(), 18);
				console.log(" SVM BetBear is "+_betOnBear);
				const _Price = ethers.parseUnits(_bPrice.toString(), 18);
				console.log(" SVM the price is "+_Price);
				console.log(_betOnBull, _betOnBear);

				//increase gasPrice
				const gasPrice = await web3.eth.getGasPrice();
				console.log(" SVM gasPrice is ",gasPrice);
				const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
				console.log(" SVM increased gas is ",increasedGasPrice);

			
				//write to the blockchain.
				try{
					const tx = await contract2.ForceExecute(_Price, _timestamp, _betOnBull, _betOnBear, {gasPrice:increasedGasPrice});//look into this line and complete it.
					console.log(" SVM Force Execute completed from smart contract...");
					// Wrap both promises in an array
					const promises = [
						new Promise((resolve, reject) => {
							contract.once("ExecuteForced", async(event)=>{
								console.log(" SVM Force Execution signal received...");
								resolve();
							});
						}),
						tx.wait()
					];

					// Wait for both promises to resolve
					await Promise.all(promises);

					console.log(" SVM Fininshed first force Execute, calling the second one");
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
				console.log(" SVM Starting Second forceExecute...");
				await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
				.then(async(response) => {
				// Extract and use the price from the response
				console.log(" SVM price stage passed.")
				const _bPrice = response.data.price;
				console.log(' SVM BTC/USDT Price:', ethers.parseUnits(_bPrice.toString(), 18));
			
				// Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
				const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
				const num1 = randomNumber1;
				const num2 = randomNumber2;
				console.log(num1, num2);
				const _timestamp= Math.floor(new Date().getTime()/1000);
				console.log(" SVM timestamp is "+timestamp);
				const _betOnBull= ethers.parseUnits(num1.toString(), 18);
				console.log(" SVM BetBull is "+_betOnBull);
				const _betOnBear= ethers.parseUnits(num2.toString(), 18);
				console.log(" SVM BetBear is "+_betOnBear);
				const _Price = ethers.parseUnits(_bPrice.toString(), 18);
				console.log(" SVM the price is "+_Price);
				console.log(_betOnBull, _betOnBear);

				//increase gasPrice
				const gasPrice = await web3.eth.getGasPrice();
				console.log(" SVM gasPrice is ",gasPrice);
				const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
				console.log(" SVM increased gas is ",increasedGasPrice);

			
				//write to the blockchain.
				try{
					const tx = await contract2.ForceExecute(_Price, _timestamp, _betOnBull, _betOnBear, {gasPrice:increasedGasPrice});//look into this line and complete it.
					console.log(" SVM Force Execute completed from smart contract...");
					// Wrap both promises in an array
					const promises = [
						new Promise((resolve, reject) => {
							contract.once("ExecuteForced", async(event)=>{
								console.log(" SVM Force Execution signal received...");
								resolve();
							});
						}),
						tx.wait()
					];

					// Wait for both promises to resolve
					await Promise.all(promises);

					console.log(" SVM Fininshed secons force Execute");

					io.emit("ForcedExecute", true);
					io.emit("ForcedExecute1", true);
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
			console.log(" SVM This shoud never be reached during operation...");
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
    console.log(" SVM Inside the getSignal... waiting for the next 5 mins to launch resetContract23..");

    setTimeout(()=>{
        console.log(" SVM Inside the first setTimeout... launching resetContract23..");
        // resetContract23();
		verifyTime();
        console.log(" SVM resetcontract23 called..");
    }, remainingTime);
}

async function verifyTime(){
	console.log(" SVM inside verify time...");
	const time_now = Math.floor(new Date().getTime()/1000);
	console.log(" SVM time_now is : "+time_now);
	const end_time = parseInt(blockStartTime + 300);
	console.log(" SVM start time is : "+blockStartTime);
	console.log(" SVM end time is : "+end_time);
	try{
		const blockNumber = await provider_svm.getBlockNumber();
		const block = await provider_svm.getBlock(blockNumber);
		const block_time = parseInt(block.timestamp);
		console.log(" SVM block time is : "+block_time);

		if(block_time > (end_time)){
			console.log(" SVM Requirements satisfied, calling execute function...");
			Execute();
			console.log(" SVM Execute1() called...");
			// restartAndExecute();
		}else{
			console.log(" SVM requirements not met, trying again...");
			setTimeout( ()=>{
				verifyTime();
			},5000)
		}

	}catch(e){
		console.log(e);
	}
}

async function resetContract23(){
	console.log(" SVM closing provider2 and 3...");
	console.log(" SVM both providers closed..");
	provider_svm=null;
	web3=null;
	provider_svm = new ethers.JsonRpcProvider(SVMNETWORK);
	web3 = new Web3('https://rpc.stratovm.io');
	wallet2 = new ethers.Wallet(privateKey, provider_svm);
	contract2 = new ethers.Contract(contractAdress, abi, wallet2);
	console.log(" SVM both providers opened and parameters set...calling verify Time now");
	verifyTime();
}

async function resetForced(){
    console.log(" SVM inside reset forced function");
	new Promise(async(resolve)=>{
		console.log(" SVM inside reset promise...");
		counterStartTime = new Date().getTime();
		console.log(" SVM reset counterstart time set...");
		//push to redis
	    await Client.set("counterStartTime1", counterStartTime);
		console.log(" SVM reset counter start saved to redis...");
		remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);
		console.log(" SVM  reset remaining time is :"+remainingTime);
		resolve();
		console.log(" SVM reset resolved...");
	})
	.then(()=>{
		getSignal();
		console.log(" SVM get Signal called.");
	})
    .catch((e)=>{
		console.log(e);
	})
}

async function Execute(){

    console.log(" SVM Using Execute1 to call the contract..");
    
    if(isPaused===false){
        console.log(" SVM isPaused test passed")
        //get binance price
        await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        .then(async(response) => {
        // Extract and use the price from the response
        console.log(" SVM price stage passed.")
        bPrice = response.data.price;
        console.log(' SVM BTC/USDT Price:', ethers.parseUnits(bPrice.toString(), 18));

		//Reconnect wsProvider
		await reConnectWsProvider();
		console.log(" SVM wsProvider reconnected..");
    
        // Example: Generate a pair of random numbers between 0.5 and 1.5 with a maximum difference of 0.5
        const [randomNumber1, randomNumber2] = generateValidRandomPair((_minHouseBetRatio / 100), 1);
        const num1 = randomNumber1;
        const num2 = randomNumber2;
        console.log(num1, num2);
        timestamp= Math.floor(new Date().getTime()/1000);
        console.log(" SVM timestamp is "+timestamp);
        betOnBull= ethers.parseUnits(num1.toString(), 18);
        console.log(" SVM BetBull is "+betOnBull);
        betOnBear= ethers.parseUnits(num2.toString(), 18);
        console.log(" SVM BetBear is "+betOnBear);
        Price = ethers.parseUnits(bPrice.toString(), 18);
        console.log(" SVM the price is "+Price);
        console.log(betOnBull, betOnBear);

		//Perform Maths Operations to calcualte for wonOdd, rewardsClaimable and whowon.
		// const params = await Client.hgetall('LockRound1');
		// previousBullOdd = params.previousBullOdd;
		// previousBearOdd = params.previousBearOdd;
		// lockedprice = params.lockedprice;
		// const BullAmount = params.BullAmount;
		// const BearAmount = params.BearAmount;

		// if(bPrice > lockedprice){
		// 	wonOdd = ethers.parseUnits(previousBullOdd.toString(), 18);
		// 	console.log(" SVM won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BullAmount * 0.94 * previousBullOdd)).toString(), 18);
		// 	console.log(" SVM rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 1
		// 	console.log(" SVM who won is: ",whoWon);

		// }else if(bPrice < lockedprice){
		// 	wonOdd = ethers.parseUnits(previousBearOdd.toString(), 18);
		// 	console.log(" SVM won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BearAmount * 0.94 * previousBearOdd)).toString(), 18);
		// 	console.log(" SVM rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 2
		// 	console.log(" SVM who won is: ",whoWon);

		// }else if(bPrice == lockedprice){
		// 	wonOdd = 1
		// 	console.log(" SVM won odd is: ",wonOdd);
		// 	rewardsClaimable = ethers.parseUnits((parseFloat(BullAmount + BearAmount)).toString(), 18);
		// 	console.log(" SVM rewardsClaimable is ",rewardsClaimable);
		// 	whoWon = 3
		// 	console.log(" SVM who won is: ",whoWon);
		// }

		// //increase gasPrice
		// const gasPrice = await web3.eth.getGasPrice();
		// console.log(" SVM gasPrice is ",gasPrice);
		// const increasedGasPrice = web3.utils.toBigInt(parseInt((web3.utils.toNumber(gasPrice)*12)/10));
		// console.log(" SVM increased gas is ",increasedGasPrice);

    
        //write to the blockchain.
        try{
			const tx = await contract2.Execute(Price, timestamp, betOnBull, betOnBear);//look into this line and complete it.
			console.log(" SVM Execute completed from smart contract...");
			nonce = tx.nonce;
			console.log(" SVM The execute nonce is ",tx.nonce);
			TxConfirmation();
            // Wrap both promises in an array
            const promises = [
                new Promise((resolve, reject) => {
                    contract.once("StartRound", async(epoch, roundTimestamp, event) => {
                        console.log(" SVM StartRound event received....");
						clearTimeout(ConfirmationId);
						ConfirmationId = null;
						console.log(" SVM ConfirmationId cleared..");
						clearTimeout(restartId);
						restartId = null;
						console.log(" SVM restart cleared...");

						counterStartTime = new Date().getTime();
						remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);

						blockStartTime = parseInt(roundTimestamp.toString());
						endTime = (parseInt(roundTimestamp.toString())*1000 +(304000));
						console.log(" SVM endtime done "+endTime);
						//push to redis
						await Client.set("counterStartTime1", counterStartTime);
						console.log(" SVM counterStartTime set for new round...");
                        resolve();
                    });
                }),
                tx.wait()
            ];

            // Wait for both promises to resolve
            await Promise.all(promises);
			getSignal();
            console.log(" SVM Get signal function called again...");
          }
        catch(e){
            console.log(e);
			// console.warn(" SVM Execute failed..retring it in 10s");
			// setTimeout(async()=>{
				// Execute()
			// },10000)
        };
     })
      .catch((error) => {
        console.error('Error:', error.message);
      });
    
      console.log(" SVM The end!");
    }else{
        console.log(" SVM isPaused is True");
    }    
        
}

// work on this ASAP
async function restartAndExecute(){
	console.log(" SVM Waiting for 60s to restart and force execute if startRound signal is not received..");

	restartId = setTimeout(async() => {
		console.log(" SVM 60s elepsed and startRound event not recieved.. proceeding to restart...");
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
			console.log(' SVM Dyno restarted:', response.data);
		} catch (error) {
			console.error('Error restarting dyno:', error.response ? error.response.data : error.message);
		}

	}, 60000);
}

async function TxConfirmation(){
	console.log(" SVM Waiting for 30s before calling ReExecute function...");

	ConfirmationId = setTimeout(()=>{
		//code ..
		console.log(" SVM 30s elapsed and no startRound signal gotten. Proceeding to ReExecute...");
		ReExecute();
	},30000);
}

async function ReExecute(){
	console.log(" SVM ReCalling the Execute function now...");
	const gasPrice = await web3.eth.getGasPrice();
	console.log(" SVM gasPrice is ",gasPrice);
	const increasedGasPrice = web3.utils.toBigInt(parseInt(web3.utils.toNumber(gasPrice)*2));
	console.log(" SVM increased gas is ",increasedGasPrice);
	try{
		const tx = await contract2.Execute(Price, timestamp, betOnBull, betOnBear, {nonce:nonce, gasPrice:increasedGasPrice});//look into this line and complete it.
		console.log(" SVM ReExecute completed......");
		nonce = tx.nonce;
		console.log(" SVM the reexecute nonce is ", tx.nonce);
		TxConfirmation();
		// Wrap both promises in an array
		const promises = [
			new Promise((resolve, reject) => {
				contract.once("StartRound", async(epoch, roundTimestamp, event) => {
					console.log(" SVM StartRound event received....");
					clearTimeout(ConfirmationId);
					ConfirmationId = null;
					console.log(" SVM ConfirmationId cleared..");

					counterStartTime = new Date().getTime();
					remainingTime = 300000 - ((new Date().getTime()) - counterStartTime);

					blockStartTime = parseInt(roundTimestamp.toString());
					endTime = (parseInt(roundTimestamp.toString())*1000 +(304000));
					console.log(" SVM endtime done "+endTime);
					//push to redis
					await Client.set("counterStartTime1", counterStartTime);
					console.log(" SVM counterStartTime set for new round...");
					resolve();
				});
			}),
			tx.wait()
		];

		// Wait for both promises to resolve
		await Promise.all(promises);
		getSignal();
		console.log(" SVM Get signal function called again...");
	  }
	catch(e){
		console.log(e);
		// console.log(" SVM ReExecute failed.. retrying in 10s");
		// setTimeout(async() => {
			// ReExecute()
		// }, 10000);
	};
}

console.log(" SVM Worker Started...");
