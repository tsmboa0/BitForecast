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
app.use(sslRedirect.HTTPS({ trustProtoHeader: true }));
console.log("Hello middleware");

const Client = new Redis(process.env.REDISCLOUD_URL);
// const Client = redis.createClient();

console.log("The value for the rediscloud url is :"+process.env.REDISCLOUD_URL);

getReload();

// Client.on('connect', function() {
//     console.log('Connected to Redis server');
// });

  
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
let provider_polygon;
let wallet_polygon;
let contract_polygon;

let provider_svm;
let wallet_svm;
let contract_svm;

// Polygon Connection Details
const contractAdress_polygon="0x6131D6D4E610260b2C0F41A0513D81D0605cC86f";
const abi_polygon =[
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
provider_polygon = new ethers.WebSocketProvider(bscNetwork);
const privateKey = process.env.PRIVATEKEY;
wallet_polygon = new ethers.Wallet(privateKey, provider_polygon);
contract_polygon = new ethers.Contract(contractAdress_polygon, abi_polygon, wallet_polygon);

// StratoVM Connection Details
const contractAdress_svm="0x6131D6D4E610260b2C0F41A0513D81D0605cC86f";
const abi_svm =[
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
provider_svm = new ethers.WebSocketProvider(SVMNETWORK);
wallet_svm = new ethers.Wallet(privateKey, provider_svm);
contract_svm = new ethers.Contract(contractAdress_svm, abi_svm, wallet_svm);

//Frontend parameters for Polygon
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

// Frontend parameters for StratoVM
let endTime1; //done
let nextEpoch1; //done
let currentEpoch1; //done
let previousEpoch1; //done
let currentBullOdd1; //done
let currentBearOdd1;  //done
let previousBullOdd1; //done
let previousBearOdd1;  //done
let previousLockedPrice1; //done
let lockedprice1; //done
let wonOdd1; //done
let currentPricePool1; //done
let nextPricePool1; //done
let previousPricePool1; //done
let isPaused1 = false;//done
let history_Tab1 = [];//done
let _minHouseBetRatio1=90;
// let gas_price;
let signalTimeout1;
let LockAutomateSignal1;
let remainingTime1;
let counterStartTime1;
let Price_1;
let tradeData1;
let isNeutralize1 = false;


async function getReload(){
	// await Client.connect();
	// await Client.flushdb();
	// await Client.FLUSHALL();
	// console.log("all info cleared..");
	// await Client.set("LockAutomateSignal", 'true');

	const start_round = await Client.hgetall("StartRound0");
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

	const lock_round = await Client.hgetall("LockRound");
	currentEpoch = lock_round.currentEpoch;
	lockedprice = lock_round.lockedprice;
	currentPricePool = lock_round.currentPricePool;
	previousBullOdd = lock_round.previousBullOdd;
	previousBearOdd = lock_round.previousBearOdd;

	const bet_odds = await Client.hgetall("Betodds");
	currentBullOdd = bet_odds.currentBullOdd;
	currentBearOdd = bet_odds.currentBearOdd;
	nextPricePool = bet_odds.nextPricePool;

	const end_round = await Client.hgetall("EndRound");
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

	const history_tab = await Client.lrange("history_Tab", 0, -1);
    const history_string = history_tab.map(JSON.parse);
    console.log("the history length is :" + history_string.length);
	history_Tab = history_string;

	const tests = await Client.hgetall("test");
	console.log("the greeting is :"+tests.greet);
	console.log("the time is :"+tests.time);

	// Reload For SVM Starts From Here

	const start_round1 = await Client.hgetall("StartRound1");
	console.log(" SVM StartRound epoch is :"+start_round1.nextEpoch);
	endTime1 = start_round1.endTime;
	console.log("the SVM end time issue is "+endTime1);
	nextEpoch1 = parseInt(start_round1.nextEpoch);

	const lock_Automate1 = await Client.get("LockAutomateSignal1");
	LockAutomateSignal1= lock_Automate1;
	console.log("SVM Lockautomate Signal is :"+LockAutomateSignal1);
	if(LockAutomateSignal1==='true'){
		const counter_start1 = await Client.get("counterStartTime1");
		counterStartTime1 = counter_start1;
		console.log("SVM counterStart is :"+counterStartTime1);
		remainingTime1 = parseInt(endTime1) - (new Date().getTime());
		console.log("the SVM Remaining time is :"+remainingTime1);
		if(remainingTime1===0){
			console.log("SVM remaining Time less than zero, calling the getSignal0 function...");
			// getSignal0();
		}else if(remainingTime1>0){
			console.log("There is a remaining Time in SVM, calling the getSignal function...");
			// getSignal();
		}else if(remainingTime1<0){
			console.log("SVM remaining Time less than zero");
			///pass
		}else{
			console.log("This shoud never be reached during operation...");
		}
	};

	const lock_round1 = await Client.hgetall("LockRound1");
	currentEpoch1 = lock_round1.currentEpoch;
	lockedprice1 = lock_round1.lockedprice;
	currentPricePool1 = lock_round1.currentPricePool;
	previousBullOdd1 = lock_round1.previousBullOdd;
	previousBearOdd1 = lock_round1.previousBearOdd;
	// console.log('current price pool1 is ',currentPricePool1);
	console.log('locked price is ',lockedprice1);

	const bet_odds1 = await Client.hgetall("Betodds1");
	currentBullOdd1 = bet_odds1.currentBullOdd;
	currentBearOdd1 = bet_odds1.currentBearOdd;
	nextPricePool1 = bet_odds1.nextPricePool;
	console.log('next price pool1 is ',nextPricePool1);

	const end_round1 = await Client.hgetall("EndRound1");
	previousPricePool1 = end_round1.previousPricePool;
	previousLockedPrice1 = end_round1.previousLockedPrice;
	previousEpoch1 = end_round1.previousEpoch;
	wonOdd1 = end_round1.wonOdd;
	// console.log('previous price pool1 is ',previousPricePool1);
	console.log('previous locked price is ',previousLockedPrice1);
	historyTab1();

	const is_paused1 = await Client.get("isPaused1");
	if(is_paused1=='true'){
		isPaused1 = true;
	}else{
		isPaused1 = false;
	};

	const history_tab1 = await Client.lrange("history_Tab1", 0, -1);
    const history_string1 = history_tab1.map(JSON.parse);
    console.log("the SVM history length is :" + history_string1.length);
	history_Tab1 = history_string1;

	const tests1 = await Client.hgetall("test1");
	console.log("the greeting is :"+tests1.greet);
	console.log("the time is :"+tests1.time);

};

require('events').EventEmitter.defaultMaxListeners = 15;

// io.sockets.setMaxListeners(20); // Increase the limit to 20 (or an appropriate value)

io.on('connection', async(socket) => {
    console.log('A user connected');
  
    // Example: Emit a message to the client when a user connects to Polygon Network
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

	// When user connects to stratoVM
	socket.emit('message1', 'Hello from server');
    socket.emit("endTime1", endTime1);
    socket.emit("nextEpoch1", nextEpoch1);
    socket.emit("currentEpoch1", currentEpoch1);
    socket.emit("previousEpoch1", previousEpoch1);
    socket.emit("currentBullOdd1", currentBullOdd1);
    socket.emit("currentBearOdd1", currentBearOdd1);
    socket.emit("previousBullOdd1", previousBullOdd1);
    socket.emit("previousBearOdd1", previousBearOdd1);
    socket.emit("previousLockedPrice1", previousLockedPrice1);
    socket.emit("lockedprice1", lockedprice1);
    socket.emit("outcome1", wonOdd1);
    socket.emit("previousPricePool1", previousPricePool1);
    socket.emit("currentPricePool1", currentPricePool1);
    socket.emit("nextPricePool1", nextPricePool1);
    socket.emit("contractPaused1", isPaused1);
    socket.emit("contractPaused1", isPaused1);
	socket.emit("history_Tab1", history_Tab1);

	// StrtoVM Ends
	
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
		// console.log("MATIC Price is "+Price_);
	})
	.catch((e)=>{
		// console.log("MATIC price didnt work out");
	})
},300000);

// BitCoin Price every half second.
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
		console.log("BTC Price didnt work out");
	})
},500);

async function reconnectWait(){
	console.log("start round signal receieved... waiting 5 mins before reconnecting to wsProvider..");
	setTimeout(() => {
		console.log("calling reconnectWsProvider function...");
		reConnectWsProvider();
	}, 240000);
}
// Reconnect Wait for StratoVM
async function reconnectWait1(){
	console.log("SVM start round signal receieved... waiting 5 mins before reconnecting to wsProvider..");
	setTimeout(() => {
		console.log("calling SVM reconnectWsProvider function...");
		reConnectWsProvider1();
	}, 240000);
}

async function reConnectWsProvider(){
	console.log("closing the connection to webSocketProvider..");
	isNeutralize = true;
	reActivateListeners();
	provider_polygon.websocket.close();
	console.warn("reopening socket...");
	provider_polygon = new ethers.WebSocketProvider(bscNetwork);
	wallet_polygon = new ethers.Wallet(privateKey, provider_polygon);
	contract_polygon = new ethers.Contract(contractAdress_polygon, abi_polygon, wallet_polygon);
	console.log(await provider_polygon.getBlockNumber());
	const tx = await contract_polygon.isParentSet("0x4FC2988B2Fbd411767d08ef8768dB77e6A46DDfF");
	console.log("parent is ",tx);
	isNeutralize = false;

	reActivateListeners();
}

// Reconnect wsProvider for StratoVM
async function reConnectWsProvider1(){
	console.log("closing the SVM connection to webSocketProvider..");
	// For StratoVM
	isNeutralize1 = true;
	reActivateListeners1();
	provider_svm.websocket.close();
	console.warn("reopening socket...");
	provider_svm = new ethers.WebSocketProvider(SVMNETWORK);
	wallet_svm = new ethers.Wallet(privateKey, provider_svm);
	contract_svm = new ethers.Contract(contractAdress_svm, abi_svm, wallet_svm);
	console.log(await provider_svm.getBlockNumber());
	const tx1 = await contract_svm.isParentSet("0x4FC2988B2Fbd411767d08ef8768dB77e6A46DDfF");
	console.log("parent is ",tx1);
	isNeutralize1 = false;
	// StratoVM ends

	reActivateListeners1();
}


provider_polygon.websocket.on('open', ()=>{
	console.warn("welcome to your webSocket connection..")
})

provider_polygon.websocket.on('close', async()=>{
	console.warn("wss closed..");
	// reConnectWsProvider()
});

provider_polygon.websocket.on('error', async()=>{
	console.warn("wss errored..");
	// reConnectWsProvider()
});
// Websocket on, close and err for SVM
provider_svm.websocket.on('open', ()=>{
	console.warn("welcome to your SVM webSocket connection..")
})

provider_svm.websocket.on('close', async()=>{
	console.warn("SVM wss closed..");
	// reConnectWsProvider()
});

provider_svm.websocket.on('error', async()=>{
	console.warn(" SVM wss errored..");
	// reConnectWsProvider()
});

async function reActivateListeners(){
	//
	if (!isNeutralize){
		//
		const eventPromises = [
			new Promise((resolve, reject) => {
				contract_polygon.on("LockAutomate", async(event)=>{
					console.log("Round Automate Emitted");
					// remainingTime = 305000;
					// getSignal();
					// await Client.set("LockAutomateSignal", 'true');
				})
			}),
			new Promise((resolve, reject) => {
				contract_polygon.on("InjectFunds", async(sender, event) => {
					console.log("Admin Injected Funds ");
				});
			}),
			new Promise((resolve, reject) => {
				//When Round Starts in the BlockChain.
				contract_polygon.on("StartRound", async(epoch, roundTimestamp, event)=>{
					console.log("A new Round Just started "+epoch);
					console.log("Round Timestamp is "+roundTimestamp);
					console.log((roundTimestamp.toString()));
					endTime0 = (parseInt(roundTimestamp.toString())*1000 +(304000));
					console.log("endtime done "+endTime0);
					nextEpoch0 = parseInt(epoch.toString());
					console.log("nextEpoch Passed.");
					console.log("A new round has started at time "+endTime0);
					
					//set values to redis
					await Client.hset("StartRound0", {
						'endTime': endTime0,
						'nextEpoch': nextEpoch0,
					});
					console.log("start round saved to redis");
					//pass value to frontend using socket.io

					io.emit("endTime", endTime0);
					io.emit("nextEpoch", nextEpoch0);
					console.log(endTime0);
					console.log(nextEpoch0);

					reconnectWait();
				});
			}),
			new Promise((resolve, reject) => {
				contract_polygon.on("EndRound", async(epoch, pool, lockedPrice, outcome, event)=>{
					previousEpoch = epoch.toString();
					wonOdd = parseFloat(ethers.formatEther(outcome.toString())).toFixed(2);
					previousPricePool = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
					previousLockedPrice = parseFloat(ethers.formatEther(lockedPrice.toString())).toFixed(2);
				
					//set values to redis
					await Client.hset('EndRound', {
						'previousEpoch':previousEpoch,
						'wonOdd': wonOdd,
						'previousPricePool': previousPricePool,
						'previousLockedPrice':previousLockedPrice
					});
					console.log("end round saved to redis");
				
					historyTab();
					
					//pass value to the frontend.
				
					io.emit("previousEpoch", previousEpoch);
					io.emit("outcome", wonOdd);
					io.emit("previousPricePool", previousPricePool);
					io.emit("previousLockedPrice", previousLockedPrice);
				});
			}),
			new Promise((resolve, reject) => {
				contract_polygon.on("LockRound", async(epoch, price, bullOdd, bearOdd, pool, event)=> {
					console.log("Previous Round Locked..."+epoch);
					currentEpoch = parseInt(epoch.toString());
					console.log("Current Epoch passed "+currentEpoch);
					lockedprice = parseFloat(ethers.formatEther(price.toString())).toFixed(2);
					console.log("locked Price is "+lockedprice);
				
					currentPricePool = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
					previousBullOdd = parseFloat(ethers.formatEther(bullOdd.toString())).toFixed(2);
					previousBearOdd = parseFloat(ethers.formatEther(bearOdd.toString())).toFixed(2);
				
					//store data on redis
					await Client.hset('LockRound', {
						'currentEpoch': currentEpoch,
						'lockedprice': lockedprice,
						'currentPricePool': currentPricePool,
						'previousBullOdd': previousBullOdd,
						'previousBearOdd': previousBearOdd,
						'BullAmount': '',
						'BearAmount': ''
					});
					console.log("Lock round saved to redis");
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
			}),
			new Promise((resolve, reject) => {
				contract_polygon.on("Betodds", async(epoch, bullOdd, bearOdd, pool, event)=>{
					console.log("Bet Odd entered "+bullOdd);
				
					currentBullOdd = parseFloat(ethers.formatEther(bullOdd.toString())).toFixed(2);
					currentBearOdd = parseFloat(ethers.formatEther(bearOdd.toString())).toFixed(2);
					nextPricePool = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
				
					//set values to redis
					await Client.hset('Betodds', {
						'currentBullOdd': currentBullOdd,
						'currentBearOdd': currentBearOdd,
						'nextPricePool': nextPricePool
					});
					console.log("Bet Odds saved to redis");
					// pass value to the frontend using socket.io
				
					io.emit("currentBullOdd", currentBullOdd);
					io.emit("currentBearOdd", currentBearOdd);
					io.emit("nextPricePool", nextPricePool);
				});
			}),
			new Promise((resolve, reject) => {
				contract_polygon.on("ExecuteForced", (event)=>{
					console.log("Force Execution signal received...");
					// resetForced();
				});
			})
		];

		await Promise.all(eventPromises);
	}else{
		console.log("isNeutralize is true");
	}

	console.log("exiting reActivateListners..");
}
reActivateListeners();

// Reactivate Listners for SVM
async function reActivateListeners1(){
	//
	if (!isNeutralize1){
		//
		const eventPromises = [
			new Promise((resolve, reject) => {
				contract_svm.on("LockAutomate", async(event)=>{
					console.log("Round Automate Emitted on SVM");
					// remainingTime = 305000;
					// getSignal();
					// await Client.set("LockAutomateSignal", 'true');
				})
			}),
			new Promise((resolve, reject) => {
				contract_svm.on("InjectFunds", async(sender, event) => {
					console.log("Admin Injected Funds on SVM");
				});
			}),
			new Promise((resolve, reject) => {
				//When Round Starts in the BlockChain.
				contract_svm.on("StartRound", async(epoch, roundTimestamp, event)=>{
					console.log("A new Round Just started on SVM "+epoch);
					console.log("SVM Round Timestamp is "+roundTimestamp);
					console.log((roundTimestamp.toString()));
					endTime1 = (parseInt(roundTimestamp.toString())*1000 +(304000));
					console.log("endtime SVM done "+endTime1);
					nextEpoch1 = parseInt(epoch.toString());
					console.log("SVM nextEpoch Passed.");
					console.log("A new round has startedon SVM at time "+endTime0);
					
					//set values to redis
					await Client.hset("StartRound1", {
						'endTime': endTime1,
						'nextEpoch': nextEpoch1,
					});
					console.log(" SVM start round saved to redis");
					//pass value to frontend using socket.io

					io.emit("endTime1", endTime1);
					io.emit("nextEpoch1", nextEpoch1);
					console.log(endTime1);
					console.log(nextEpoch1);

					reconnectWait1();
				});
			}),
			new Promise((resolve, reject) => {
				contract_svm.on("EndRound", async(epoch, pool, lockedPrice, outcome, event)=>{
					previousEpoch1 = epoch.toString();
					wonOdd1 = parseFloat(ethers.formatEther(outcome.toString())).toFixed(2);
					previousPricePool1 = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
					previousLockedPrice1 = parseFloat(ethers.formatEther(lockedPrice.toString())).toFixed(2);
				
					//set values to redis
					await Client.hset('EndRound1', {
						'previousEpoch':previousEpoch1,
						'wonOdd': wonOdd1,
						'previousPricePool': previousPricePool1,
						'previousLockedPrice':previousLockedPrice1
					});
					console.log("SVM end round saved to redis");
				
					historyTab1();
					
					//pass value to the frontend.
				
					io.emit("previousEpoch1", previousEpoch1);
					io.emit("outcome1", wonOdd1);
					io.emit("previousPricePool1", previousPricePool1);
					io.emit("previousLockedPrice1", previousLockedPrice1);
				});
			}),
			new Promise((resolve, reject) => {
				contract_svm.on("LockRound", async(epoch, price, bullOdd, bearOdd, pool, event)=> {
					console.log("SVM Previous Round Locked..."+epoch);
					currentEpoch1 = parseInt(epoch.toString());
					console.log("SVM Current Epoch passed "+currentEpoch1);
					lockedprice1 = parseFloat(ethers.formatEther(price.toString())).toFixed(2);
					console.log("SVM locked Price is "+lockedprice1);
				
					currentPricePool1 = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
					previousBullOdd1 = parseFloat(ethers.formatEther(bullOdd.toString())).toFixed(2);
					previousBearOdd1 = parseFloat(ethers.formatEther(bearOdd.toString())).toFixed(2);
				
					//store data on redis
					await Client.hset('LockRound1', {
						'currentEpoch': currentEpoch1,
						'lockedprice': lockedprice1,
						'currentPricePool': currentPricePool1,
						'previousBullOdd': previousBullOdd1,
						'previousBearOdd': previousBearOdd1,
						'BullAmount': '',
						'BearAmount': ''
					});
					console.log("SVM Lock round saved to redis");
					//pass value to the frontend using socket.io
				
					io.emit("currentEpoch1", currentEpoch1);
					io.emit("lockedprice1", lockedprice1);
					io.emit("currentPricePool1", currentPricePool1);
					io.emit("previousBullOdd1", previousBullOdd1);
					io.emit("previousBearOdd1", previousBearOdd1);
					console.log(currentEpoch1);
					console.log(lockedprice1);
					console.log(currentPricePool1);
					console.log(previousBullOdd1);
					console.log(previousBearOdd1);
				});
			}),
			new Promise((resolve, reject) => {
				contract_svm.on("Betodds", async(epoch, bullOdd, bearOdd, pool, event)=>{
					console.log("SVM Bet Odd entered "+bullOdd);
				
					currentBullOdd1 = parseFloat(ethers.formatEther(bullOdd.toString())).toFixed(2);
					currentBearOdd1 = parseFloat(ethers.formatEther(bearOdd.toString())).toFixed(2);
					nextPricePool1 = parseFloat(ethers.formatEther(pool.toString())).toFixed(2);
				
					//set values to redis
					await Client.hset('Betodds1', {
						'currentBullOdd': currentBullOdd1,
						'currentBearOdd': currentBearOdd1,
						'nextPricePool': nextPricePool1
					});
					console.log("Bet Odds saved to redis");
					// pass value to the frontend using socket.io
				
					io.emit("currentBullOdd1", currentBullOdd1);
					io.emit("currentBearOdd1", currentBearOdd1);
					io.emit("nextPricePool1", nextPricePool1);
				});
			}),
			new Promise((resolve, reject) => {
				contract_svm.on("ExecuteForced", (event)=>{
					console.log("SVM Force Execution signal received...");
					// resetForced();
				});
			})
		];

		await Promise.all(eventPromises);
	}else{
		console.log("isNeutralize1 is true");
	}

	console.log("exiting SVM reActivateListners..");
}
reActivateListeners1();


//Min bet Amount Updated
contract_polygon.on("MinBetAmountUpdated", (epoch, minBetAmount, event)=>{
	//
	_minHouseBetRatio = parseInt(minBetAmount.toString());
});

contract_polygon.on("ContractPaused_", async(epoch, event)=>{
	//
	isPaused=true;
	// await Client.set("ispaused", 'true');
	io.emit("contractPaused", isPaused);
});

//Contract Unpaused
contract_polygon.on("ContractUnpaused_", async(epoch, event)=>{
	//
	isPaused=false;
	await Client.set("ispaused", 'false');
	io.emit("contractUnpaused", isPaused);
});

//Execute Forced


//historyTab for polygon Network
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

		const history_tab0 = await Client.lrange("history_Tab", 0, -1);
		const history_string0 = history_tab0.map(JSON.parse);

		if (history_string0.length === 9) {
			// Remove last item from Redis
			await Client.rpop("history_Tab");
			// Send to redis
			await Client.lpush("history_Tab", jsonString);
		} else if (history_string0.length > 9) {
			// Trim the list to keep only the first 9 items
			await Client.ltrim("history_Tab", 0, 8);
			// Send to redis
			await Client.lpush("history_Tab", jsonString);
		} else {
			// Send to redis
			await Client.lpush("history_Tab", jsonString);
		}

		const history_tab1 = await Client.lrange("history_Tab", 0, -1);
		const history_string1 = history_tab1.map(JSON.parse);

		history_Tab = history_string1;
		io.emit("history_Tab", history_Tab);
		
		console.log("not redis history length is :"+history_Tab.length);
}

//historyTab for SVM Network
async function historyTab1() {
	    //
		console.log('inside the history1 block');
		let result1;
		if (lockedprice1 > previousLockedPrice1) {
			result1 = 1;
		} else if (lockedprice1 < previousLockedPrice1) {
			result1 = 2;
		} else if (lockedprice1 === previousLockedPrice1) {
			result1 = 3;
		}

		console.log('the history result is ',result1);
		const dict1 = {
			"result": result1,
			"epoch": previousEpoch1,
		};
	
		const jsonString = JSON.stringify(dict1);

		const history_tab0 = await Client.lrange("history_Tab1", 0, -1);
		const history_string0 = history_tab0.map(JSON.parse);

		if (history_string0.length === 9) {
			// Remove last item from Redis
			await Client.rpop("history_Tab1");
			// Send to redis
			await Client.lpush("history_Tab1", jsonString);
		} else if (history_string0.length > 9) {
			// Trim the list to keep only the first 9 items
			await Client.ltrim("history_Tab1", 0, 8);
			// Send to redis
			await Client.lpush("history_Tab1", jsonString);
		} else {
			// Send to redis
			await Client.lpush("history_Tab1", jsonString);
		}

		const history_tab1 = await Client.lrange("history_Tab1", 0, -1);
		const history_string1 = history_tab1.map(JSON.parse);

		history_Tab1 = history_string1;
		io.emit("history_Tab1", history_Tab1);
		
		console.log(" SVM not redis history length is :"+history_Tab1.length);
}
  


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
});