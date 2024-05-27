
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

//initialize connection
const socket = io();

//receive the first data
socket.on('message', (data) => {
    console.log(data);
  });


socket.on('previousEpoch', (data) => {
    console.log(data);
    localStorage.setItem("previousEpoch", data);
    document.getElementById('previousEpoch').innerText='Previous Round #'+data;
  });
  
  socket.on('currentEpoch', (data) => {
    console.log(data);
    // localStorage.setItem("currentEpoch", data);
    document.getElementById('currentEpoch').innerText='Ongoing Round #'+data;

	myPick(data);
  });

  socket.on('nextEpoch', (data) => {
    console.log(data);
    // localStorage.setItem("nextEpoch", data);
    document.getElementById('nextEpoch').innerText='Next Round #'+data;
  });

  socket.on('previousBullOdd', (data) => {
    console.log(data);
    // localStorage.setItem("previousBullOdd", data);
    document.getElementById('previousBullOdd').innerText=data+'x';
  });

  socket.on('previousBearOdd', (data) => {
    console.log(data);
    // localStorage.setItem("previousBearOdd", data);
    document.getElementById('previousBearOdd').innerText=data+'x';
  });

  socket.on('currentBullOdd', (data) => {
    console.log(data);
    // localStorage.setItem("currentBullOdd", data);
    document.getElementById('currentBullOdd').innerText=data+'x';
  });

  socket.on('currentBearOdd', (data) => {
    console.log(data);
    // localStorage.setItem("currentBearOdd", data);
    document.getElementById('currentBearOdd').innerText=data+'x';
  });

  socket.on('previousLockedPrice', (data) => {
    console.log(data);
    localStorage.setItem("previousLockedPrice", data);
    document.getElementById('previousLockedPrice').innerText='$ '+data;
  });

  socket.on('lockedprice', (data) => {
    console.log(data);
	const diff_ = data - localStorage.getItem("previousLockedPrice");
	const diff_color = !diff_ || diff_ ==0 ? 'white': diff_ > 0 ? 'green': 'red';
    localStorage.setItem("lockedPrice", data);

    document.getElementById('locked-Price').innerText='$ '+data;
    document.getElementById('closedPrice').innerText='$ '+data;
    document.getElementById('roundDifference').innerText= parseFloat(diff_).toFixed(2);
    document.getElementById('previous-round-img').src =!diff_ || diff_==0 ? '/Home/headstie.webp':diff_<0 ? '/BTC Prediction _ DogeBets_files/DOGE_BETS_BEARISH.5238e253.webp':diff_>0 ? '/Home/headsup.webp': '';
    document.getElementById('roundDifference').style.color = diff_color;

  });

  socket.on('outcome', (data) => {
    console.log(data);
    // localStorage.setItem("outcome", 2.06);
    document.getElementById('outcome').innerText= data+'x';
  });

  socket.on('previousPricePool', (data) => {
    console.log(data);
    // localStorage.setItem("previousPricePool", data);
    document.getElementById('previousPricePool').innerText=data;
  });

  socket.on('currentPricePool', (data) => {
    console.log(data);
    // localStorage.setItem("currentPricePool", data);
    document.getElementById('currentPricePool').innerText=data;
  });

  socket.on('nextPricePool', (data) => {
    console.log(data);
    // localStorage.setItem("nextPricePool", data);
    document.getElementById('nextPricePool').innerText=data;
  });

  /**socket.on("gasPrice", (data)=> {
    console.log(data);
    localStorage.setItem("gasPrice", data);
    document.getElementsByClassName('gasPrice').innerText= data+' gwei';
  })*/

  socket.on("contractPaused", (data)=> {
	console.log("Contract Paused is :"+data);
    if(data=='true'){
        document.getElementById('Predict').style.display='none';
        document.getElementById('chart').style.display='none';
        document.getElementById('paused').style.display='block';
    }else{
		document.getElementById('Predict').style.display='block';
		document.getElementById('chart').style.display='block';
		document.getElementById('paused').style.display='none';
	}
  })

  socket.on("contractUnpaused", (data)=> {
	console.log("contract unpaused is :"+data);
    document.getElementById('Predict').style.display='block';
    document.getElementById('chart').style.display='block';
    document.getElementById('paused').style.display='none';
  })

  socket.on("history_Tab", (data)=> {
    const history_list = data;
	console.log("history_tab signal received...");
	console.log("the history length is :"+history_list.length);
	const historyfull = document.getElementById('historyFull');
	historyfull.innerHTML='';
    for(let i=0; i<history_list.length; i++){
		console.log("inside for loop...");

		const historydiv = document.createElement('div');

		console.log("Starting if statement...");

		if(history_list[i].result===1){
			historydiv.classList.add("flex", "flex-col", "items-center", "space-y-0", "my-1");
			historydiv.innerHTML=`<svg id="tabsvg1" aria-hidden="true" focusable="false" data-prefix="fas" class="svg-inline--fa fa-circle-up fa-2x text-mainGreen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path fill='currentColor' d='M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c141.4 0 256-114.6 256-256S397.4 0 256 0zM382.8 246.1C380.3 252.1 374.5 256 368 256h-64v96c0 17.67-14.33 32-32 32h-32c-17.67 0-32-14.33-32-32V256h-64C137.5 256 131.7 252.1 129.2 246.1C126.7 240.1 128.1 233.3 132.7 228.7l112-112c6.248-6.248 16.38-6.248 22.62 0l112 112C383.9 233.3 385.3 240.1 382.8 246.1z'></path>
			</svg>`;
			const innerdiv = document.createElement('div');
			innerdiv.className="font-bold";
			const innerp = document.createElement('p');
			innerp.classList.add("round-number","text-sm","text-mainGreen");
			innerp.innerText=history_list[i].epoch;
			innerdiv.appendChild(innerp);
			historydiv.appendChild(innerdiv);

		}else if(history_list[i].result===2){
			historydiv.classList.add("flex", "flex-col", "items-center", "space-y-0", "my-1");
			historydiv.innerHTML=`<svg id="tabsvg1" aria-hidden="true" focusable="false" data-prefix="fas" class="svg-inline--fa fa-circle-down fa-2x text-mainRed" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path fill='currentColor' d='M256 512c141.4 0 256-114.6 256-256s-114.6-256-256-256C114.6 0 0 114.6 0 256S114.6 512 256 512zM129.2 265.9C131.7 259.9 137.5 256 144 256h64V160c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32v96h64c6.469 0 12.31 3.891 14.78 9.875c2.484 5.984 1.109 12.86-3.469 17.44l-112 112c-6.248 6.248-16.38 6.248-22.62 0l-112-112C128.1 278.7 126.7 271.9 129.2 265.9z'></path>
		    </svg>`;
			const innerdiv = document.createElement('div');
			innerdiv.className="font-bold";
			const innerp = document.createElement('p');
			innerp.classList.add("round-number","text-sm","text-mainRed");
			innerp.innerText=history_list[i].epoch;
			innerdiv.appendChild(innerp);
			historydiv.appendChild(innerdiv);

		}else if(history_list[i].result===3){
			historydiv.classList.add("flex", "flex-col", "items-center", "space-y-0", "my-1");
			historydiv.innerHTML=`<svg id="tabsvg1" aria-hidden="true" focusable="false" data-prefix="fas" class="svg-inline--fa fa-circle-up fa-2x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path fill='currentColor' d='M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c141.4 0 256-114.6 256-256S397.4 0 256 0zM382.8 246.1C380.3 252.1 374.5 256 368 256h-64v96c0 17.67-14.33 32-32 32h-32c-17.67 0-32-14.33-32-32V256h-64C137.5 256 131.7 252.1 129.2 246.1C126.7 240.1 128.1 233.3 132.7 228.7l112-112c6.248-6.248 16.38-6.248 22.62 0l112 112C383.9 233.3 385.3 240.1 382.8 246.1z'></path>
			</svg>`;
			const innerdiv = document.createElement('div');
			innerdiv.className="font-bold";
			const innerp = document.createElement('p');
			innerp.classList.add("round-number","text-sm");
			innerp.style.color='whitesmoke';
			innerp.innerText=history_list[i].epoch;
			innerdiv.appendChild(innerp);
			historydiv.appendChild(innerdiv);
		}else{
			//pass
		}

		historyfull.appendChild(historydiv);
		console.log("historyfull.....");
    }
  })

if(window.ethereum){
    window.ethereum.on('accountsChanged', async (accounts)=>{
        //code here
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
    
        try{
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            document.getElementById('connect_button').innerText=(address).substring(0,5)+'...'+(address).substring((address.length)-5, (address).length);
			document.getElementById("referral-code").innerText="https://bulleyesvault.live/?ref="+address;
            // document.getElementById('bnbBalance').innerText= balance+' BNB';
        }catch(e){
            //
            document.getElementById('not_conneted').style.display='block';
        }
      })
    
      window.ethereum.on('chainChanged', (chainId)=>{
        //code here
        if(chainId==137){
            //Remove blinking...
            document.getElementById('connect_button').classList.remove('blinking');
        }else{
            //blinking...
            document.getElementById('connect_button').classList.add('blinking');
        }
      })
}

//function GetAllParams
/**function getAllParams(){
    console.log(localStorage.getItem("contractPaused"));
    if(localStorage.getItem("contractPaused")=='true'){
        document.getElementById('Predict').style.display='none';
        document.getElementById('chart').style.display='none';
        document.getElementById('paused').style.display='block';

    }else if(localStorage.getItem("contractPaused")=='false'){
        document.getElementById('Predict').style.display='block';
        document.getElementById('chart').style.display='block';
        document.getElementById('paused').style.display='none';
        

    }

}*/

async function Check(){
    //check if a user is already connected and check network.
    if(window.ethereum){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();

            try{
                const address = await signer.getAddress();
				const contract =  new ethers.Contract(contractAdress, abi, signer);
                document.getElementById('not_connected').style.display='none';
                document.getElementById('connect_button').style.display='block';
                document.getElementById('connect_button').innerText=(address).substring(0,5)+'...'+(address).substring((address.length)-5, (address).length);
				document.getElementById("not-connected-wallet-code").style.display='none';
				document.getElementById("connected-wallet-code").style.display='block';
				document.getElementById("referral-code").innerText="https://bulleyesvault.live/?ref="+address;
    
                //detect network.
                const network = await provider.getNetwork();
				console.log("isparent set is ");
                if(network.chainId==137){
					console.log("Tryingggggggg...");
					const isparentset = await contract.isParentSet(address);
                    console.log("isparent set is ",isparentset);
                    const parentAddy = await contract.ParentAddress(address);
                    if(isparentset == true){
                        document.getElementById("not-referred").style.display='none';
                        document.getElementById("referred").style.display='block';
                        document.getElementById("referred").innerText ="You were referred by "+parentAddy;
                    }else{
                        //                              
                    }
                    //Remove blinking...
                    document.getElementById('connect_button').classList.remove('blinking');
                }else{
                    //blinking...
                    document.getElementById('connect_button').classList.add('blinking');
                }
            }catch(e){
                //Do nothing for now.
            }

        }catch(e){
            console.log(e);
        }
    }
}

Check();

// Function to execute your logic
async function executeLogic() {
    document.getElementById("counting").style.display='none';
    document.getElementById("executing").style.display='block';
    document.getElementById("previousBlock").style.display='none';
    document.getElementById("currentBlock").style.display='none';
    document.getElementById("nextBlock").style.display='none';

    document.getElementById("ExecutionNotice1").style.display='block';
    document.getElementById("ExecutionNotice2").style.display='block';
    document.getElementById("ExecutionNotice3").style.display='block';
    console.log("Executing your logic...");
    // Add your logic here
  }
  
  
  // Function to start the timer
  function startTimer() {
    
    var here = localStorage.getItem("endTime");
	console.log("here is "+here);
	console.log("the time now is "+new Date().getTime());

    x = setInterval(function() {
        // Get today's date and time
    var now = new Date().getTime();
  
    // Find the distance between now and the countdown date
    var distance = here - now;
  
    // Check if 5 minutes have passed
    if (distance <= 1) {
        // Reset the timer for the next 5 minutes
        clearInterval(x);       
        // Execute your logic
        executeLogic();
    }else{
            // Time calculations for minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //Display the bet cards

        document.getElementById("ExecutionNotice1").style.display='none';
        document.getElementById("ExecutionNotice2").style.display='none';
        document.getElementById("ExecutionNotice3").style.display='none';

        document.getElementById("previousBlock").style.display='block';
        document.getElementById("currentBlock").style.display='block';
        document.getElementById("nextBlock").style.display='block';
  
        // Display the countdown timer
        document.getElementById("counting").style.display='block';
        document.getElementById("executing").style.display='none';

        document.getElementById("mins").innerHTML =minutes;
        document.getElementById("secs").innerHTML =seconds;
    }
    
    }, 1000);
  }

  socket.on('endTime', (data) => {
    console.log(data);
    localStorage.setItem("endTime", data);
    console.log(localStorage.getItem("endTime"));

    startTimer();
  });

//   let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
  let stockPriceElement = document.getElementById('binance-price');
  let priceDiff = document.getElementById('binance-price-diff');
  let pricePercent = document.getElementById('binance-price-percentage');
  let priceImg = document.getElementById('binance-price-img');
  let bbb = document.getElementById("binance-container");

  socket.on("btc_usdt", (data)=>{

	let lastPrice = localStorage.getItem("lockedPrice");
    let price = parseFloat(data).toFixed(2);
    let diff = parseFloat(price - lastPrice).toFixed(2);
    let percentage = parseFloat((diff/price)*100).toFixed(2);
    stockPriceElement.innerText = '$ '+ price;
    priceDiff.innerText = '$ '+ diff;
    pricePercent.innerText = percentage + '%';
    priceImg.src = !lastPrice || lastPrice === price ? '/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_TIE.8d4d2660.webp' :price > lastPrice ? "/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_UP.10fa57bc.webp": "/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_DOWN.eb917c42.webp";
    pricePercent.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558': '#ff7777';
    bbb.style.borderColor = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558': '#ff7777';
    priceDiff.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558':'#ff7777';
    stockPriceElement.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558':'#ff7777';
    lastPrice = localStorage.getItem("lockedPrice");
  });


  /**ws.onmessage = (event) => {
    // console.log(event.data)
    let lastPrice = localStorage.getItem("lockedPrice");
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p).toFixed(2);
    let diff = parseFloat(price - lastPrice).toFixed(2);
    let percentage = parseFloat((diff/price)*100).toFixed(2);
    stockPriceElement.innerText = '$ '+ price;
    priceDiff.innerText = '$ '+ diff;
    pricePercent.innerText = percentage + '%';
    priceImg.src = !lastPrice || lastPrice === price ? '/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_TIE.8d4d2660.webp' :price > lastPrice ? "/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_UP.10fa57bc.webp": "/BTC Prediction _ DogeBets_files/DOGE_BETS_CIRCLE_DOWN.eb917c42.webp";
    pricePercent.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558': '#ff7777';
    bbb.style.borderColor = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558': '#ff7777';
    priceDiff.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558':'#ff7777';
    stockPriceElement.style.color = !lastPrice || lastPrice === price ? 'whitesmoke' :price > lastPrice ? '#66B558':'#ff7777';
    lastPrice = localStorage.getItem("lockedPrice");

  }*/

  async function connect(){
    if (window.ethereum){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            var accounts = await provider.send("eth_requestAccounts", []);
            var signer = await provider.getSigner();
            var address = await signer.getAddress();
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(address);
            document.getElementById('not_connected').style.display='none';
            document.getElementById('connect_button').style.display='block';
            document.getElementById('connect_button').innerText=(address).substring(0,5)+'...'+(address).substring((address.length)-5, (address).length);
            // document.getElementById('bnbBalance').innerText= balance+' BNB';

            if(network.chainId==137){
                //Remove blinking...
                document.getElementById('connect_button').classList.remove('blinking');
            }else{
                //Add Blinking
                document.getElementById('connect_button').classList.add('blinking');
            }
        }catch (error){
            alert(error+"Please Connect to MetaMask");
        }
    }else{
      alert('Please install a MetaMask wallet or any other compatible wallet');
    }
  }

  async function switchToBSCNetwork() {
	console.log("inside switch to POLYGON Network function...");
    if (window.ethereum) {
      try {
		console.log("awaiting the switch request...");
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Corrected to '0x38' for BSC mainnet or 0x61 for bsc testnet
        });
		console.log("")
        document.getElementById('disconnectModal').style.display='none';
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum-compatible wallet.');
    }
  }

  async function placebetNow(){
    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =await provider.getSigner();
        const network =await provider.getNetwork();
        try{
            const address =await signer.getAddress();
            const balance =await provider.getBalance(address);
            const balance_ = parseFloat((ethers.utils.formatEther(balance)).toString()).toFixed(3);
            if(network.chainId==137){
                Promise.all([
                    document.getElementById('next_bet').style.display='none',
                    document.getElementById('place_bet').style.display='block'
                ]).then(async()=>{
                    document.getElementById('bnbBalanceBull').innerText =balance_+" MATIC";
                    await socket.emit("getBnbPrice", null);
                    await socket.on("bnbPrice", (data)=>{
                        const value = parseFloat(data) * 1;
                        document.getElementById('bullBetAmountFiat').textContent=parseFloat(value).toFixed(2);
                    })
                }).catch((e)=>{
                    console.log(e)
                })
            }else{
                //Change to POLYGON Network
                alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }catch(e){
            alert("Please connect MetaMask to continue.");
        }
    }else{
        alert("Please install MetaMask or any other EVM compatible wallet.")
    }

  }

  async function placebetbear(){
    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =await provider.getSigner();
        const network =await provider.getNetwork();
        try{
            const address =await  signer.getAddress();
            const balance = await provider.getBalance(address);
            const balance_ = parseFloat((ethers.utils.formatEther(balance)).toString()).toFixed(3);
            if(network.chainId==137){
                Promise.all([
                    document.getElementById('next_bet').style.display='none',
                    document.getElementById('place_bet_bear').style.display='block'
                ]).then(async()=>{
                    document.getElementById('bnbBalanceBear').innerText = balance_+" MATIC";
                    await socket.emit("getBnbPrice", null);
                    await socket.on("bnbPrice", (data)=>{
                        const value = parseFloat(data) * 1;
                        document.getElementById('bearBetAmountFiat').textContent=parseFloat(value).toFixed(2);
                    })
                }).catch((e)=>{
                    console.log(e)
                })
            }else{
                //Change to POLYGON Network
                alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }catch(e){
            alert("Please connect MetaMask to continue.");
        }
    }else{
        alert("Please install MetaMask or any other EVM compatible wallet.")
    }

  }

  async function getConversionRate(value_){
    //get from backend..
    await socket.emit("getBnbPrice", null);
    await socket.on("bnbPrice", (data)=>{
        console.log("The Price is "+data);
        //do something..
        if(document.getElementById('place_bet').style.display=='block'){
            const amountInput = parseFloat(value_);
            console.log("amountInput is "+amountInput);
            const value = parseFloat(parseFloat(data) * amountInput);
            console.log("value is "+value);
            const amountOutput = document.getElementById('bullBetAmountFiat');
            amountOutput.textContent=parseFloat(value).toFixed(2);
			document.getElementById('bullBetAmount0').value = value_;

        }else if(document.getElementById('place_bet_bear').style.display=='block'){
            const amountInput = parseFloat(value_);
            const value = parseFloat(parseFloat(data) * amountInput);
            const amountOutput = document.getElementById('bearBetAmountFiat');
            amountOutput.textContent=parseFloat(value).toFixed(2);
			document.getElementById('bearBetAmount0').value = value_;
        }
    })
  }


  async function percentageValue(value){
	if(window.ethereum){
		console.log("inside percentage value..."+value);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =await provider.getSigner();
        const network =await provider.getNetwork();
        try{
            const address =await  signer.getAddress();
            const balance = await provider.getBalance(address);
            const balance_ = parseFloat((ethers.utils.formatEther(balance)).toString()).toFixed(3);
            if(network.chainId==137){
				if(document.getElementById('place_bet').style.display=='block'){
					document.getElementById('percentInput0').value = value;
				}else if(document.getElementById('place_bet_bear').style.display=='block'){
					document.getElementById('percentInput1').value = value;
				}
				const percentageValue = parseFloat((value/100) * balance_);
				getConversionRate(percentageValue);
				console.log("get Conversion rate function called...");
            }
        }catch(e){
			console.log(e);
        }
    }
  }

  async function user_BetBull(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);
        const value = document.getElementById('bullBetAmount0').value;
		const myAddress = await signer.getAddress();
		const filter = contract.filters.BetBull(myAddress,null,null);

        if(value<5){
            alert("Bet Amount cannot be less than 5 MATIC. Please increase your stake");
        }else{
            const param = {value: ethers.utils.parseUnits(value, 18)};

            if(network.chainId==137){
				let storedReferralCode = localStorage.getItem('referralCode');
				if (storedReferralCode) {
					console.log('Stored Referral Code:', storedReferralCode);
					const _isParentSet = await contract.isParentSet(myAddress);
					if(_isParentSet==true){
						//call the contract
						try{
							const tx = await contract.user_BetBull(param);
							await contract.on(filter, (sender, epoch, amount, event) => {
								const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
								alert("You have placed a bull bet worth "+newPrice+" MATIC");
							});
						}catch(err){
							alert(err.data.message);
						}
					}else{
						//call bet and set parent function
						if(storedReferralCode==myAddress){
							try{
								const tx = await contract.user_BetBull(param);
								await contract.on(filter, (sender, epoch, amount, event) => {
									const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
									alert("You have placed a bull bet worth "+newPrice+" MATIC");
								});
							}catch(err){
								alert(err.data.message);
							}
						}else{
							try{
								const tx = await contract.userBetBullAndSetParent(storedReferralCode, param);
								await contract.on(filter, (sender, epoch, amount, event) => {
									localStorage.removeItem("referralCode");
									console.log("referralCode removed from local storage");
									const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
									alert("You have placed a bull bet worth "+newPrice+" MATIC");
								});
							}catch(err){
								alert(err.data.message);
							}
						}
					}
				}else{
					try{
						const tx = await contract.user_BetBull(param);
						await contract.on(filter, (sender, epoch, amount, event) => {
							const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
							alert("You have placed a bull bet worth "+newPrice+" MATIC");
						});
					}catch(err){
						alert(err.data.message);
					}
				}
            }else{
                //Change to POLYGON Network
                alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }


    }
  }

  async function user_BetBear(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);
        const value = document.getElementById('bearBetAmount0').value;
		const myAddress = await signer.getAddress();
		const filter = contract.filters.BetBear(myAddress,null,null);

        if(value<5){
            alert("Bet Amount cannot be less than 5 MATIC. Please increase your stake");
        }else{
            const param = {value: ethers.utils.parseUnits(value, 18)};

            if(network.chainId==137){
				let storedReferralCode = localStorage.getItem('referralCode');
				if (storedReferralCode) {
					console.log('Stored Referral Code:', storedReferralCode);
					const _isParentSet = await contract.isParentSet(myAddress);
					if(_isParentSet==true){
						try{
							const tx = await contract.user_BetBear(param);
							await contract.on(filter, (sender, epoch, amount, event) => {
								const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
								alert("You have placed a bull bet worth "+newPrice+" MATIC");
							});
						}catch(err){
							alert(err.data.message);
						}
					}else{
						//set parent and place bets
						if(storedReferralCode==myAddress){
							try{
								const tx = await contract.user_BetBear(param);
								await contract.on(filter, (sender, epoch, amount, event) => {
									const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
									alert("You have placed a bull bet worth "+newPrice+" MATIC");
								});
							}catch(err){
								alert(err.data.message);
							}
						}else{
							try{
								const tx = await contract.userBetBearAndSetParent(storedReferralCode, param);
								await contract.on(filter, (sender, epoch, amount, event) => {
									localStorage.removeItem("referralCode");
									console.log("referralCode removed from local storage");
									const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
									alert("You have placed a bull bet worth "+newPrice+" MATIC");
								});
							}catch(err){
								alert(err.data.message);
							}
						}
					}
				}else{
					try{
						const tx = await contract.user_BetBear(param);
						await contract.on(filter, (sender, epoch, amount, event) => {
							const newPrice = parseFloat(parseFloat((value * 5)/100) + parseFloat(ethers.utils.formatEther(amount)))
							alert("You have placed a bull bet worth "+newPrice+" MATIC");
						});
					}catch(err){
						alert(err.data.message);
					}
				}
            }else{
                //Change to POLYGON Network
                alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }

    }
  }


  async function myPick(epoch){
    if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =await provider.getSigner();
        const network =await provider.getNetwork();
		const contract = new ethers.Contract(contractAdress, abi, signer);
        try{
            const address =await  signer.getAddress();
            const balance = await provider.getBalance(address);
            const balance_ = parseFloat((ethers.utils.formatEther(balance)).toString()).toFixed(3);
            if(network.chainId==137){
				const mybet = await contract.Bets(epoch,address);
				console.log("myBet is "+mybet.position);
				if(mybet.position===1){
					document.getElementById("myBetBull").style.display='block';
				}else if(mybet.position===2){
					document.getElementById("myBetBear").style.display='block';
				}else{
					document.getElementById("myBetBear").style.display='none';
					document.getElementById("myBetBull").style.display='none';
					console.log("No bet for this round...");
				}
            }else{
                //Change to POLYGON Network
                console.log("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }catch(e){
            console.log(e);
        }
    }else{
        console.log("Please install MetaMask or any other EVM compatible wallet.")
    }

  }





