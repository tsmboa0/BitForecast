const {ethers} = require('ethers');
const express = require('express');
const cron = require('node-cron');
const dotenv = require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const url = require("url");
const redis = require("redis");
const Redis = require("ioredis");
const sslRedirect = require('express-sslify');
const {web3} = require('web3');
const WSocket = require('ws');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Use the middleware to enforce
// app.use(sslRedirect.HTTPS({ trustProtoHeader: true }));

// const Client = new Redis(process.env.REDISCLOUD_URL);
const Client = redis.createClient();

// console.log("The value for the rediscloud url is :"+process.env.REDISCLOUD_URL);

getReload();

Client.on('connect', function() {
    console.log('Connected to Redis server');
});

  
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

//Socket
const server = http.createServer(app);
const io = new Server(server);

//Contract interaction
let provider;
let wallet;
let contract;

const contractAdress="0xea3f590CB571d1C4a1EdF58F4958e22BBF545979";
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
				"name": "bullAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bearAmount",
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
				"name": "bullAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bearAmount",
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
			},
			{
				"internalType": "uint256",
				"name": "_wonOdd",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_rewardsClaimable",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_whoWon",
				"type": "uint8"
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
		"name": "ParentAddress",
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
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			}
		],
		"name": "SetReferral",
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
		"inputs": [],
		"name": "getInvitees",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
				"name": "_parent",
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
				"name": "_parent",
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
				"internalType": "struct BullesyesVault.History[]",
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
provider = new ethers.WebSocketProvider(bscNetwork);
const privateKey = process.env.PRIVATEKEY;
wallet = new ethers.Wallet(privateKey, provider);
contract = new ethers.Contract(contractAdress, abi, wallet);

//wss connection, error and reconnection logic


//Frontend parameters
let endTime0; //done
let nextEpoch0; //done
let currentEpoch; //done
let previousEpoch; //done
let currentBullOdd; //done
let currentBearOdd;  //done
let previousBullOdd; //done
let previousBearOdd;  //done
let previousLockedPrice; //done
let lockedprice; //done
let wonOdd; //done
let currentPricePool; //done
let nextPricePool; //done
let previousPricePool; //done
let isPaused = false;//done
let history_Tab = [];//done
let _minHouseBetRatio=90;
// let gas_price;
let signalTimeout;
let LockAutomateSignal;
let remainingTime;
let counterStartTime;
let Price_;
let tradeData;
let isNeutralize = false;


async function getReload(){
	await Client.connect();
	// await Client.flushdb();
	// await Client.FLUSHALL();
	// console.log("all info cleared..");
	// await Client.set("LockAutomateSignal", 'true');

	const start_round = await Client.hGetAll("StartRound0");
	console.log("StartRound epoch is :"+start_round.nextEpoch);
	endTime0 = start_round.endTime;
	console.log("the end time issue is "+endTime0);
	nextEpoch0 = parseInt(start_round.nextEpoch);

	const lock_Automate = await Client.get("LockAutomateSignal");
	LockAutomateSignal= lock_Automate;
	console.log("Lockautomate Signal is :"+LockAutomateSignal);
	if(LockAutomateSignal==='true'){
		const counter_start = await Client.get("counterStartTime");
		counterStartTime = counter_start;
		console.log("counterStart is :"+counterStartTime);
		remainingTime = parseInt(endTime0) - (new Date().getTime());
		console.log("the Remaining time is :"+remainingTime);
		if(remainingTime===0){
			console.log("remaining Time less than zero, calling the getSignal0 function...");
			// getSignal0();
		}else if(remainingTime>0){
			console.log("There is a remaining Time, calling the getSignal function...");
			// getSignal();
		}else if(remainingTime<0){
			console.log("remaining Time less than zero");
			///pass
		}else{
			console.log("This shoud never be reached during operation...");
		}
	};

	const lock_round = await Client.hGetAll("LockRound");
	currentEpoch = lock_round.currentEpoch;
	lockedprice = lock_round.lockedprice;
	currentPricePool = lock_round.currentPricePool;
	previousBullOdd = lock_round.previousBullOdd;
	previousBearOdd = lock_round.previousBearOdd;

	const bet_odds = await Client.hGetAll("Betodds");
	currentBullOdd = bet_odds.currentBullOdd;
	currentBearOdd = bet_odds.currentBearOdd;
	nextPricePool = bet_odds.nextPricePool;

	const end_round = await Client.hGetAll("EndRound");
	previousPricePool = end_round.previousPricePool;
	previousLockedPrice = end_round.previousLockedPrice;
	previousEpoch = end_round.previousEpoch;
	wonOdd = end_round.wonOdd;

	const is_paused = await Client.get("isPaused");
	if(is_paused=='true'){
		isPaused = true;
	}else{
		isPaused = false;
	};

	const history_tab = await Client.lRange("history_Tab", 0, -1);
    const history_string = history_tab.map(JSON.parse);
    console.log("the history length is :" + history_string.length);
	history_Tab = history_string;

	const tests = await Client.hGetAll("test");
	console.log("the greeting is :"+tests.greet);
	console.log("the time is :"+tests.time);

};

require('events').EventEmitter.defaultMaxListeners = 15;

// io.sockets.setMaxListeners(20); // Increase the limit to 20 (or an appropriate value)

io.on('connection', async(socket) => {
    console.log('A user connected');
  
    // Example: Emit a message to the client when a user connects
    socket.emit('message', 'Hello from server');
    socket.emit("endTime", endTime0);
    socket.emit("nextEpoch", nextEpoch0);
    socket.emit("currentEpoch", currentEpoch);
    socket.emit("previousEpoch", previousEpoch);
    socket.emit("currentBullOdd", currentBullOdd);
    socket.emit("currentBearOdd", currentBearOdd);
    socket.emit("previousBullOdd", previousBullOdd);
    socket.emit("previousBearOdd", previousBearOdd);
    socket.emit("previousLockedPrice", previousLockedPrice);
    socket.emit("lockedprice", lockedprice);
    socket.emit("outcome", wonOdd);
    socket.emit("previousPricePool", previousPricePool);
    socket.emit("currentPricePool", currentPricePool);
    socket.emit("nextPricePool", nextPricePool);
    socket.emit("contractPaused", isPaused);
	socket.emit("history_Tab", history_Tab);
    // socket.emit("gasPrice", gas_price);
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    //get BNB Price from Binance.
    socket.on('getBnbPrice', async()=>{
        console.log("getBnbPrice signal received");

		console.log("the BNB Price is "+Price_);

        //emit price to frontend.
        socket.emit("bnbPrice", Price_);
        console.log("Price Emitted");
    });
  });

setInterval(async()=>{
	await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT")
	.then(async(response) => {
	    Price_ = response.data.price;
		console.log("MATIC Price is "+Price_);
	})
	.catch((e)=>{
		console.log("MATIC price didnt work out");
	})
},300000);

provider.websocket.on('open', ()=>{
	console.warn("welcome to your webSocket connection..")
})

provider.websocket.on('close', async()=>{
	console.warn("wss closed..");
	console.warn("reopening socket...");
	provider = new ethers.WebSocketProvider(bscNetwork);
	wallet = new ethers.Wallet(privateKey, provider);
	contract = new ethers.Contract(contractAdress, abi, wallet);
	console.log(await provider.getBlockNumber());
	const tx = await contract.isParentSet("0x4FC2988B2Fbd411767d08ef8768dB77e6A46DDfF");
	console.log("parent is ",tx);
});


contract.on("LockAutomate", async(event)=>{
	console.log("Round Automate Emitted");
	// remainingTime = 305000;
	// getSignal();
	// await Client.set("LockAutomateSignal", 'true');
})

contract.on("InjectFunds", async(sender, event) => {
	console.log("Admin Injected Funds ");
});

 //When Round Starts in the BlockChain.
 contract.on("StartRound", async(epoch, roundTimestamp, event)=>{
	console.log("A new Round Just started "+epoch);
	console.log("Round Timestamp is "+roundTimestamp);
	console.log((roundTimestamp.toString()));
	endTime0 = (parseInt(roundTimestamp.toString())*1000 +(304000));
	console.log("endtime done "+endTime0);
	nextEpoch0 = parseInt(epoch.toString());
	console.log("nextEpoch Passed.");
	console.log("A new round has started at time "+endTime0);
	
	//set values to redis
	await Client.hSet("StartRound0", {
		'endTime': endTime0,
		'nextEpoch': nextEpoch0,
	});
	//pass value to frontend using socket.io

	io.emit("endTime", endTime0);
	io.emit("nextEpoch", nextEpoch0);
	console.log(endTime0);
	console.log(nextEpoch0);
});

//End Round
contract.on("EndRound", async(epoch, pool, lockedPrice, outcome, event)=>{
	previousEpoch = epoch.toString();
	wonOdd = parseFloat(ethers.formatEther(outcome.toString())).toFixed(2);
	previousPricePool = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
	previousLockedPrice = parseFloat(ethers.formatEther(lockedPrice.toString())).toFixed(2);

	//set values to redis
	await Client.hSet('EndRound', {
		'previousEpoch':previousEpoch,
		'wonOdd': wonOdd,
		'previousPricePool': previousPricePool,
		'previousLockedPrice':previousLockedPrice
	});

	historyTab();
	
	//pass value to the frontend.

	io.emit("previousEpoch", previousEpoch);
	io.emit("outcome", wonOdd);
	io.emit("previousPricePool", previousPricePool);
	io.emit("previousLockedPrice", previousLockedPrice);
});

//Lock Round
contract.on("LockRound", async(epoch, price, bullAmount, bearAmount, event)=> {
	console.log("Previous Round Locked..."+epoch);
	currentEpoch = parseInt(epoch.toString());
	console.log("Current Epoch passed "+currentEpoch);
	lockedprice = parseFloat(ethers.formatEther(price.toString())).toFixed(2);
	console.log("locked Price is "+lockedprice);

	//Perform maths operation to calculate bet odds.
	const _BullAmount = parseFloat(ethers.formatEther(bullAmount.toString())).toFixed(2);
	console.log("Bull Amount is ", _BullAmount)
	const _BearAmount = parseFloat(ethers.formatEther(bearAmount.toString())).toFixed(2);
	console.log("Bear Amount is ",_BearAmount)
	const _Total = parseFloat(parseFloat(_BullAmount) + parseFloat(_BearAmount)).toFixed(2);
	console.log("Total Amount is ",_Total)

	let _BullOdd = parseFloat(_Total/_BullAmount).toFixed(2);
	let _BearOdd = parseFloat(_Total/_BearAmount).toFixed(2);

	if(_BullOdd > 3){
		_BullOdd = 4 - _BearOdd;
	}else{
		//
	}
	if(_BearOdd > 3){
		_BearOdd = 4 - _BullOdd;
	}else{
		//
	}

	currentPricePool = _Total;
	previousBullOdd = _BullOdd;
	previousBearOdd = _BearOdd;

	//store data on redis
	await Client.hSet('LockRound', {
		'currentEpoch': currentEpoch,
		'lockedprice': lockedprice,
		'currentPricePool': currentPricePool,
		'previousBullOdd': previousBullOdd,
		'previousBearOdd': previousBearOdd,
		'BullAmount': _BullAmount,
		'BearAmount': _BearAmount
	});
	//pass value to the frontend using socket.io

	io.emit("currentEpoch", currentEpoch);
	io.emit("lockedprice", lockedprice);
	io.emit("currentPricePool", currentPricePool);
	io.emit("previousBullOdd", previousBullOdd);
	io.emit("previousBearOdd", previousBearOdd);
	console.log(currentEpoch);
	console.log(lockedprice);
	console.log(currentPricePool);
	console.log(previousBullOdd);
	console.log(previousBearOdd);
});

//BetOdds
contract.on("Betodds", async(epoch, bullAmount, bearAmount, event)=>{
	console.log("Bet Odd entered "+bullAmount);

	//Perform maths operation to calculate bet odds.
	const _BullAmount = parseFloat(ethers.formatEther(bullAmount.toString())).toFixed(2);
	const _BearAmount = parseFloat(ethers.formatEther(bearAmount.toString())).toFixed(2);
	const _Total = parseFloat(parseFloat(_BullAmount) + parseFloat(_BearAmount)).toFixed(2);

	let _BullOdd1 = parseFloat(_Total/_BullAmount).toFixed(2);
	let _BearOdd1 = parseFloat(_Total/_BearAmount).toFixed(2);

	if(_BullOdd1 > 3){
		_BullOdd1 = 4 - _BearOdd1;
	}else{
		//
	}
	if(_BearOdd1 > 3){
		_BearOdd1 = 4 - _BullOdd1;
	}else{
		//
	}

	currentBullOdd = _BullOdd1;
	currentBearOdd = _BearOdd1;
	nextPricePool = _Total;

	//set values to redis
	await Client.hSet('Betodds', {
		'currentBullOdd': currentBullOdd,
		'currentBearOdd': currentBearOdd,
		'nextPricePool': nextPricePool
	});
	// pass value to the frontend using socket.io

	io.emit("currentBullOdd", currentBullOdd);
	io.emit("currentBearOdd", currentBearOdd);
	io.emit("nextPricePool", nextPricePool);
});

//Min bet Amount Updated
contract.on("MinBetAmountUpdated", (epoch, minBetAmount, event)=>{
	//
	_minHouseBetRatio = parseInt(minBetAmount.toString());
});

contract.on("ContractPaused_", async(epoch, event)=>{
	//
	isPaused=true;
	// await Client.set("ispaused", 'true');
	io.emit("contractPaused", isPaused);
});

//Contract Unpaused
contract.on("ContractUnpaused_", async(epoch, event)=>{
	//
	isPaused=false;
	await Client.set("ispaused", 'false');
	io.emit("contractUnpaused", isPaused);
});

//Execute Forced
contract.on("ExecuteForced", (event)=>{
	console.log("Force Execution signal received...");
	// resetForced();
});


const btcusdt = setInterval(async()=>{
	// console.log("Live BTCUSDT price signal received");
	//
	await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
	.then(async(response) => {
		// Extract and use the price from the response
		// console.log("price stage passed.")
		const btc_usdt = response.data.price;
		// console.log("the BTCUSDT Price is "+btc_usdt);

		//emit price to frontend.
		io.emit("btc_usdt", btc_usdt);
		// console.log("LivePrice Emitted...");
	})
	.catch((e)=>{
		// console.log("BTC Price didnt work out");
	})
},500);


//Get GasPrice
/**setInterval(async() => {
    const gas = await provider.getGasPrice();
    const gasPrice = ethers.formatUnits(gas.toString(), 'gwei');
    gas_price = gasPrice;
    io.emit("gasPrice", gasPrice);
}, 20000);*/

/**function send(){
    endTime = (new Date().getTime())+120000;
    io.emit("endTime", endTime)
}

setInterval(send, 125000);//attend to this line..*/

//historyTab
async function historyTab() {
	    //
		let result;
		if (lockedprice > previousLockedPrice) {
			result = 1;
		} else if (lockedprice < previousLockedPrice) {
			result = 2;
		} else if (lockedprice === previousLockedPrice) {
			result = 3;
		}
		const dict = {
			"result": result,
			"epoch": previousEpoch,
		};
	
		const jsonString = JSON.stringify(dict);

		const history_tab0 = await Client.lRange("history_Tab", 0, -1);
		const history_string0 = history_tab0.map(JSON.parse);

		if (history_string0.length === 9) {
			// Remove last item from Redis
			await Client.rPop("history_Tab");
			// Send to redis
			await Client.lPush("history_Tab", jsonString);
		} else if (history_string0.length > 9) {
			// Trim the list to keep only the first 9 items
			await Client.lTrim("history_Tab", 0, 8);
			// Send to redis
			await Client.lPush("history_Tab", jsonString);
		} else {
			// Send to redis
			await Client.lPush("history_Tab", jsonString);
		}

		const history_tab1 = await Client.lRange("history_Tab", 0, -1);
		const history_string1 = history_tab1.map(JSON.parse);

		history_Tab = history_string1;
		io.emit("history_Tab", history_Tab);
		
		console.log("not redis history length is :"+history_Tab.length);
}
  
//House Bets function ends here!!



//static files
app.use(express.static(path.join(__dirname, 'static')));

//Urls
app.use("/", require("./urls/url"));

//templating engine
app.set('views', path.join(__dirname, 'templates')); // Set the views directory to 'templates'
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;
server.listen(port, ()=> {
    console.log("Our server is running on port", port);
}
)