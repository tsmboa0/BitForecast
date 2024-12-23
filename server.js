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

const { StartRoundW, LockAutomateW, ExecuteForcedW } = require('./worker');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Use the middleware to enforce
// app.use(sslRedirect.HTTPS({ trustProtoHeader: true }));
// console.log("Hello middleware");

const Client = new Redis(process.env.REDISCLOUD_URL);

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
const contractAdress_polygon="0x88b65350f05198f569c56b8ae1b62cea16e9b826";
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

// https://2b5f-105-113-65-106.ngrok-free.app/api/server/database?action=webhook 
const bscNetwork = process.env.POLYGONNETWORK;
provider_polygon = new ethers.WebSocketProvider(bscNetwork);
const privateKey = process.env.PRIVATEKEY;
wallet_polygon = new ethers.Wallet(privateKey, provider_polygon);
contract_polygon = new ethers.Contract(contractAdress_polygon, abi_polygon, wallet_polygon);

const contractInterface = new ethers.Interface(abi_polygon);

log_data = "0x0000000000000000000000000000000000000000000000000000000067690e11";
topic = [
	"0x056defe433649236ff1219e2f238f61b5479cc812d273b9177ca6ae5a7c010e4",
	"0x0000000000000000000000000000000000000000000000000000000000002b03"
]
console.log("The inter face for lockround is: ", contractInterface.getEvent("LockRound").topicHash);
console.log("The inter face for End Round is: ", contractInterface.getEvent("EndRound").topicHash);
console.log("The inter face for Start is: ", contractInterface.getEvent("StartRound").topicHash);
console.log("The inter face for Bet Odds is: ", contractInterface.getEvent("Betodds").topicHash);
console.log("The inter face for Lock Automate is: ", contractInterface.getEvent("LockAutomate").topicHash);
console.log("The inter face for Inject Funds is: ", contractInterface.getEvent("InjectFunds").topicHash);
console.log("The inter face for Execute forced is: ", contractInterface.getEvent("ExecuteForced").topicHash);
// console.log("decoded log is: ", contractInterface.parseLogLog("LockRound", log_data, topic)[0]); 

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
// const btcusdt = setInterval(async()=>{
// 	// console.log("Live BTCUSDT price signal received");
// 	//
// 	await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
// 	.then(async(response) => {
// 		// Extract and use the price from the response
// 		// console.log("price stage passed.")
// 		const btc_usdt = response.data.price;
// 		// console.log("the BTCUSDT Price is "+btc_usdt);

// 		//emit price to frontend.
// 		io.emit("btc_usdt", btc_usdt);
// 		// console.log("LivePrice Emitted...");
// 	})
// 	.catch((e)=>{
// 		console.log("BTC Price didnt work out");
// 	})
// },500);

// async function reconnectWait(){
// 	console.log("start round signal receieved... waiting 5 mins before reconnecting to wsProvider..");
// 	setTimeout(() => {
// 		console.log("calling reconnectWsProvider function...");
// 		reConnectWsProvider();
// 	}, 240000);
// }


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

async function LockAutomate(){
	console.log("Round Automate Emitted");
	LockAutomateW()
}

function InjectFunds(data){
	console.log(`Admin ${data[0]} injected funds`);
};

async function StartRound(data){
	console.log("A new Round Just started "+data[0]);
	console.log("Round Timestamp is "+data[1]);
	console.log((data[1].toString()));
	endTime0 = (parseInt(data[1].toString())*1000 +(304000));
	console.log("endtime done "+endTime0);
	nextEpoch0 = parseInt(data[0].toString());
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

	StartRoundW(data);
};

async function EndRound(data){
	previousEpoch = data[0].toString();
	wonOdd = parseFloat(ethers.formatEther(data[3].toString())).toFixed(2);
	previousPricePool = parseFloat(ethers.formatEther(data[1].toString())).toFixed(2);
	previousLockedPrice = parseFloat(ethers.formatEther(data[2].toString())).toFixed(2);

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
};

async function LockRound(data){
	console.log("Previous Round Locked..."+data[0]);
	currentEpoch = parseInt(data[0].toString());
	console.log("Current Epoch passed "+currentEpoch);
	lockedprice = parseFloat(ethers.formatEther(data[1].toString())).toFixed(2);
	console.log("locked Price is "+lockedprice);

	currentPricePool = parseFloat(ethers.formatEther(data[4].toString())).toFixed(2);
	previousBullOdd = parseFloat(ethers.formatEther(data[2].toString())).toFixed(2);
	previousBearOdd = parseFloat(ethers.formatEther(data[3].toString())).toFixed(2);

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
};

async function Betodds(data){
	console.log("Bet Odd entered "+data[1]);

	currentBullOdd = parseFloat(ethers.formatEther(data[1].toString())).toFixed(2);
	currentBearOdd = parseFloat(ethers.formatEther(data[2].toString())).toFixed(2);
	nextPricePool = parseFloat(ethers.formatEther(data[3].toString())).toFixed(2);

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
};

async function ExecuteForced(){
	console.log("Force Execution signal received...");
	// resetForced();

	ExecuteForcedW();
};

// async function reActivateListeners(){
// 	//
// 	if (!isNeutralize){
// 		//
// 		const eventPromises = [
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
// 				//When Round Starts in the BlockChain.
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			}),
// 			new Promise((resolve, reject) => {
				
// 			})
// 		];

// 		await Promise.all(eventPromises);
// 	}else{
// 		console.log("isNeutralize is true");
// 	}

// 	console.log("exiting reActivateListners..");
// }
// reActivateListeners();


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

  


//static files
app.use(express.static(path.join(__dirname, 'static')));

//Urls
app.use("/streams", (req, res) => {
	console.log("inside streams");
	try{
		const logs = req.body;
		console.log(logs);
		// console.log("Decoded logs are: ",decoded[0]);

		const topicHandlers = {
			"0x056defe433649236ff1219e2f238f61b5479cc812d273b9177ca6ae5a7c010e4": {
			  name: "LockRound",
			  handler: (data) => LockRound(data),
			},
			"0xfb688a8651573cda72bf570210f029fe53a509861c3d99d572100895d1c91eaa": {
			  name: "EndRound",
			  handler: (data) => EndRound(data),
			},
			"0x97d80af1e17fecbdc8ffad7d0ff8a1b8b3e4999857da8b12692490c5af307dbf": {
			  name: "StartRound",
			  handler: (data) => StartRound(data),
			},
			"0xd9a4b08a912d999d16ca771fc9d41c9d713cb7cab5ebc1a4362aa41896abd165": {
			  name: "Betodds",
			  handler: (data) => Betodds(data),
			},
			"0x06f520dc079ee5acbc43faa6fead620f2a7be361e9c5b86014f95bb18a1cdda0": {
			  name: "LockAutomate",
			  handler: () => LockAutomate(),
			},
			"0x03176945bb121d84b7e9557d5bd803f220a2d316c5b826ffa535c0dfacaa69a4": {
			  name: "InjectFunds",
			  handler: (data) => InjectFunds(data),
			},
			"0xc526a8dcb45e3cc5f262175cb8dfdba5231e38728cc60a9aa2e41c9b3d842735": {
			  name: "ExecuteForced",
			  handler: () => ExecuteForced(),
			},
		};

		// Function to process logs
		function processLogs(logs) {
			logs.forEach((log) => {
				const matchedTopic = topicHandlers[log.topics[0]];
				if (matchedTopic && matchedTopic.name !== "ExecuteForced" && matchedTopic.name !== LockAutomate) {
					console.log(`Matched Topic: ${matchedTopic.name}`);
					const decoded = contractInterface.parseLog(log).args;

					console.log("Decoded log is: ", decoded);
					matchedTopic.handler(decoded);
					console.log("Hnadler called");
				} else if (matchedTopic && matchedTopic.name == "ExecuteForced" || matchedTopic.name == LockAutomate) {
					console.log(`Matched Topic: ${matchedTopic.name}`);

					matchedTopic.handler();
					console.log("Hnadler called");
				}else{
					console.log(`No matching topic found for: ${log.topics[0]}`);
				}
			});
		}

		processLogs(logs);

		return res.status(200).json({message:"success!"})
	}catch(e){
		console.log("someting happened: ",e);
		return res.status(200).json({message: "Request recieved but failed to process"});
	}
});
app.use("/", require("./urls/url"));


//templating engine
app.set('views', path.join(__dirname, 'templates')); // Set the views directory to 'templates'
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;
server.listen(port, ()=> {
    console.log("Our server is running on port", port);
});