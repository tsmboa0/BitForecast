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

const Client = new Redis(process.env.REDISCLOUD_URL);
// const Client = redis.createClient();

console.log("The value for the rediscloud url is :"+process.env.REDISCLOUD_URL);

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
const contractAdress="0xC69F95d5E080e0515Acee0CcBfb357e051fB9a54";
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
		"anonymous": false,
		"inputs": [],
		"name": "ExecuteForced",
		"type": "event"
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
		"inputs": [],
		"name": "Pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_devWallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_ownerWallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_others",
				"type": "address"
			}
		],
		"name": "SetWallets",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"inputs": [],
		"name": "Unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
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
	}
];
const bscNetwork = process.env.POLYGONNETWORK;
const provider = new ethers.WebSocketProvider(bscNetwork);
const privateKey = process.env.PRIVATEKEY;
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAdress, abi, wallet);

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


async function getReload(){
	await Client.connect();
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
			console.log("less than, querying historic events from the blockchain...");
			nextEpoch0 = parseInt(nextEpoch0);
			const endEpoch = (nextEpoch0 - 1).toString();
			const missedEpoch = (nextEpoch0 + 1).toString();
			console.log("Missed Epoch is : "+missedEpoch);
			const startround_filter = contract.filters.StartRound(null, null);
			const lockedround_filter = contract.filters.LockRound(null, null,null,null,null);
			const endround_filter = contract.filters.EndRound(null, null,null,null);
			const betodds_filter = contract.filters.Betodds(null,null,null,null);
			
			const latestBlockNumber = await provider.getBlockNumber();
			console.log("latest block number is : "+latestBlockNumber);

			setTimeout(async()=>{
				try{
					const newEpoch = await contract.queryFilter(startround_filter, (latestBlockNumber-5000), latestBlockNumber);
					if(newEpoch.length>0){
						const result = parseInt(newEpoch[newEpoch.length-1].args.epoch);
						console.log("the query result is : "+result);
						console.log("nextEpoch0 is "+nextEpoch0);

						if(nextEpoch0===result){
							//execute has not been called...
							console.log("Execute function has not been called.. proceeding to call the execute function...");
						}else if(nextEpoch0 === (result-1)){
							console.log("Execute called... retrieving info from chain...");

							const result0 = newEpoch[newEpoch.length-1];
							const missed_roundStartTime = parseInt(result0.args.roundTimestamp);
							nextEpoch0 = parseInt(result0.args.epoch);
							endTime0 = (parseInt(missed_roundStartTime.toString())*1000 +(304000));
							console.log("endtime done "+endTime0);
							await Client.hset("StartRound0", {
								'nextEpoch': nextEpoch0,
								'endTime': endTime0
							});
							//pass value to frontend using socket.io
		
							io.emit("endTime", endTime0);
							io.emit("nextEpoch", nextEpoch0);
							console.log(endTime0);
							console.log(nextEpoch0);
		
							//End Round Details,...
							const missed_endround = await contract.queryFilter(endround_filter, (latestBlockNumber-5000), latestBlockNumber);
							console.log("The end round length is "+missed_endround.length);
							const result2 = missed_endround[missed_endround.length-1];
							console.log("the end round missed is "+result2.args.epoch.toString());
		
							previousEpoch = result2.args.epoch.toString();
							console.log("passed 1"+result2.args.outcome);
							wonOdd = parseFloat(ethers.formatEther(result2.args.outcome.toString())).toFixed(2);
							console.log("passed 2");
							previousPricePool = parseFloat(ethers.formatEther(result2.args.pool.toString())).toFixed(2);
							console.log("passed 3");
							previousLockedPrice = parseFloat(ethers.formatEther(result2.args.lockedprice.toString())).toFixed(2);
							console.log("passed 4");
						
							//set values to redis
							await Client.hset('EndRound', {
								'previousEpoch':previousEpoch,
								'wonOdd': wonOdd,
								'previousPricePool': previousPricePool,
								'previousLockedPrice':previousLockedPrice
							});
							//pass value to the frontend.
							historyTab();
						
							io.emit("previousEpoch", previousEpoch);
							io.emit("outcome", wonOdd);
							io.emit("previousPricePool", previousPricePool);
							io.emit("previousLockedPrice", previousLockedPrice);
		
							//Locked Round Details
							const missed_LockedRound = await contract.queryFilter(lockedround_filter, (latestBlockNumber-5000), latestBlockNumber);
							console.log("missed locked round length is "+missed_LockedRound.length);
							const result1 = missed_LockedRound[missed_LockedRound.length-1];
		
							console.log("Previous Round Locked..."+result1.args.epoch);
							currentEpoch = parseInt(result1.args.epoch.toString());
							console.log("Current Epoch passed "+currentEpoch);
							lockedprice = parseFloat(ethers.formatEther(result1.args.price.toString())).toFixed(2);
							console.log("locked Price is "+lockedprice);
							currentPricePool = parseFloat(ethers.formatEther(result1.args.pool.toString())).toFixed(2);
							previousBullOdd = parseFloat(ethers.formatEther(result1.args.bullOdd.toString())).toFixed(2);
							previousBearOdd = parseFloat(ethers.formatEther(result1.args.bearOdd.toString())).toFixed(2);
						
							//store data on redis
							await Client.hset('LockRound', {
								'currentEpoch': currentEpoch,
								'lockedprice': lockedprice,
								'currentPricePool': currentPricePool,
								'previousBullOdd': previousBullOdd,
								'previousBearOdd': previousBearOdd,
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
		
							//Bet Odds..
							const missed_betodds = await contract.queryFilter(betodds_filter, (latestBlockNumber-5000), latestBlockNumber);
							console.log("Missed bet odds length is : "+missed_betodds.length);
							const result3 = missed_betodds[missed_betodds.length-1];
		
							console.log("Bet Odd entered "+result3.args.bullOdd);
							currentBullOdd = parseFloat(ethers.formatEther(result3.args.bullOdd.toString())).toFixed(2);
							console.log("current bull odd is "+result3.args.currentBearOdd);
							currentBearOdd = parseFloat(ethers.formatEther(result3.args.bearOdd.toString())).toFixed(2);
							nextPricePool = parseFloat(ethers.formatEther(result3.args.pool.toString())).toFixed(2);
						
							//set values to redis
							await Client.hset('Betodds', {
								'currentBullOdd': currentBullOdd,
								'currentBearOdd': currentBearOdd,
								'nextPricePool': nextPricePool
							});
							// pass value to the frontend using socket.io
						
							io.emit("currentBullOdd", currentBullOdd);
							io.emit("currentBearOdd", currentBearOdd);
							io.emit("nextPricePool", nextPricePool);
						}else{
							//
							console.log("This should never be reached during operation...");
						}
	
	
					}else{
						console.log("The app has not been started...");
						//do something...
						//cancel round
						// const cancel_round = await contract.RoundCancel(endEpoch);
						// await contract.on("CancelRound", async(epoch, event)=>{
							// console.log("Round "+epoch+" canceled, calling execute now...");
							///
						// })
						//
					}
				}catch(e){
					console.log(e.message);
				}
			},10000);
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
},30000);

//Automate Signal
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
	await Client.hset("StartRound0", {
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
	await Client.hset('EndRound', {
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
//when Round Locks in the BlockChain
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
	await Client.hset('LockRound', {
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
})
// nextRound Betodds
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
	await Client.hset('Betodds', {
		'currentBullOdd': currentBullOdd,
		'currentBearOdd': currentBearOdd,
		'nextPricePool': nextPricePool
	});
    // pass value to the frontend using socket.io

    io.emit("currentBullOdd", currentBullOdd);
    io.emit("currentBearOdd", currentBearOdd);
    io.emit("nextPricePool", nextPricePool);
});
//Min bet amount Updated
contract.on("MinBetAmountUpdated", (epoch, minBetAmount, event)=>{
    //
    _minHouseBetRatio = parseInt(minBetAmount.toString());
})
//Contract Paused
contract.on("ContractPaused_", async(epoch, event)=>{
    //
    isPaused=true;
	// await Client.set("ispaused", 'true');
    io.emit("contractPaused", isPaused);
})

//Contract Unpaused
contract.on("ContractUnpaused_", async(epoch, event)=>{
    //
    isPaused=false;
	await Client.set("ispaused", 'false');
    io.emit("contractUnpaused", isPaused);
})

//Contract Paused sender
contract.on("ContractPaused", (account, event)=>{
    //
    // isPaused=true;
    // io.emit("contractPaused", isPaused);
})

//Contract Unpaused sender
contract.on("ContractUnpaused", (account, event)=>{
    //
    // isPaused=false;
    // io.emit("contractUnpaused", isPaused);
})
//yExecute Forced
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
		console.log("the BTCUSDT Price is "+btc_usdt);

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