
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

   async function onLoad(){
       Check();

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
           
                       //detect network.
                       const network = await provider.getNetwork();
                       if(network.chainId==93747){
                           //Remove blinking...
                           document.getElementById('connect_button').classList.remove('blinking');

                           
       try{
           const history = await contract.userHistory();
           console.log("History gotten from blockchain...");
           const reversedHistory = [...history].reverse();

           if (history.length>0){
               reversedHistory.forEach(bet => {

                   //History logic Start History.

                   var tablerow = document.createElement('tr');
                   tablerow.className ="HistoryRound";
     
     
                   var td1 = document.createElement('td');
                   td1.colSpan="1";
                   td1.className="text-center";
                   var span1 = document.createElement('span');
                   span1.className="RoundNumber";
                   span1.innerText="#"+bet.epoch;
                   td1.appendChild(span1)
                   tablerow.appendChild(td1);
     
                   var td2 = document.createElement('td');
                   td2.colSpan="1";
                   var div1 = document.createElement('b');
                   div1.className ="Position Entered";
                   if (bet.position==1){
                       div1.innerText="Bull";
                       div1.style.color="green";
                   }else if(bet.position==2){
                       div1.innerText="Bear";
                       div1.style.color="#ff7777";
                   }else{
                       //pass
                   }
                   td2.appendChild(div1);
                   tablerow.appendChild(td2);
     
                   var td3 = document.createElement('td');
                   td3.colSpan="1";
                   var div2 = document.createElement('b');
                   div2.className ="Position Closed";
                   if (bet.closed==1){
                       div2.innerText="Bull";
                       div2.style.color="green";
                   }else if(bet.closed==2){
                       div2.innerText="Bear";
                       div2.style.color="#ff7777";
                   }else if(bet.closed==3){
                       div2.innerText="Tie";
                       div2.style.color="whitesmoke";
                   }else if(bet.canceled){
                       div2.innerText="Canceled";
                       div2.style.color="#ff7777";
                   }else{
                       //pass
                   }
                   td3.appendChild(div2);
                   tablerow.appendChild(td3);
     
                   var td4 = document.createElement('td');
                   td4.colSpan="2";
                   var div3 = document.createElement('div');
                   div3.className="WagerStatistic";
                   div3.innerText=parseFloat(ethers.utils.formatEther(bet.amount)).toFixed(2);
                   var div31=document.createElement('div');
                   div31.className="NetworkCurrencySymbol active";
                   var img1=document.createElement('img');
                   img1.src="/Home/svmlogo.avif";
                   div31.appendChild(img1);
                   div3.appendChild(div31);
                   td4.appendChild(div3);
                   tablerow.appendChild(td4);

                   if(bet.canceled){
                       //Get Refund
                       var td5 = document.createElement('td');
                       td5.colSpan="2";
                       td5.className="flex items-center justify-center";
                       var div4 = document.createElement('div');
                       div4.className="WagerStatistic BearRed";
                       div4.innerText= parseFloat(ethers.utils.formatEther(bet.amount)).toFixed(2);;
                       div4.style.color="white";
                       var div41=document.createElement('div');
                       div41.className="NetworkCurrencySymbol active";
                       var img2=document.createElement('img');
                       img2.src="/Home/svmlogo.avif";
                       div41.appendChild(img2);
                       div4.appendChild(div41);
                       td5.appendChild(div4);
                       tablerow.appendChild(td5);

                       //Payment Part
                       if(bet.claimed){
                           //claimed
                           var td6 = document.createElement('td');
                           td6.colSpan="2";
                           var div5 = document.createElement('div');
                           div5.className="RoundClaim";
                           var p =document.createElement('p');
                           p.innerText="Claimed";
                           div5.appendChild(p);
                           td6.appendChild(div5);
                           tablerow.appendChild(td6);
                       }else if(!bet.claimed){
                           //claim refund
                           var td6 = document.createElement('td');
                           td6.colSpan="2";
                           var div5 = document.createElement('div');
                           div5.className="RoundClaim";
                           var p =document.createElement('div');
                           p.className="HistoryPageButton LegacyButton";
                           var button1 = document.createElement('button');
                           button1.appendChild(document.createTextNode("Get Refund"));
                           button1.onclick = function () {
                               // Call user_claimRound with the appropriate argument
                               user_claimRound(bet.epoch);
                           };
                           p.appendChild(button1);
                           div5.appendChild(p);
                           td6.appendChild(div5);
                           tablerow.appendChild(td6);
                       }else{
                           //Do nothing
                       }

                   }else{

                       if(bet.closed == 3){
                           //Get Refund
                           var td5 = document.createElement('td');
                           td5.colSpan="2";
                           td5.className="flex items-center justify-center";
                           var div4 = document.createElement('div');
                           div4.className="WagerStatistic BearRed";
                           div4.innerText= parseFloat(ethers.utils.formatEther(bet.amount)).toFixed(2);;
                           div4.style.color="white";
                           var div41=document.createElement('div');
                           div41.className="NetworkCurrencySymbol active";
                           var img2=document.createElement('img');
                           img2.src="/Home/svmlogo.avif";
                           div41.appendChild(img2);
                           div4.appendChild(div41);
                           td5.appendChild(div4);
                           tablerow.appendChild(td5);
   
                           //Payment Part
                           if(bet.claimed){
                               //claimed
                               var td6 = document.createElement('td');
                               td6.colSpan="2";
                               var div5 = document.createElement('div');
                               div5.className="RoundClaim";
                               var p =document.createElement('p');
                               p.innerText="Claimed";
                               div5.appendChild(p);
                               td6.appendChild(div5);
                               tablerow.appendChild(td6);
                           }else if(!bet.claimed){
                               //claim refund
                               var td6 = document.createElement('td');
                               td6.colSpan="2";
                               var div5 = document.createElement('div');
                               div5.className="RoundClaim";
                               var p =document.createElement('div');
                               p.className="HistoryPageButton LegacyButton";
                               var button1 = document.createElement('button');
                               button1.appendChild(document.createTextNode("Get Refund"));
                               button1.onclick = function () {
                                   // Call user_claimRound with the appropriate argument
                                   user_claimRound(bet.epoch);
                               };
                               p.appendChild(button1);
                               div5.appendChild(p);
                               td6.appendChild(div5);
                               tablerow.appendChild(td6);
                           }else{
                               //Do nothing
                           }
   
                       }else if(bet.position == bet.closed){
                           //Claim Reward
                           var td5 = document.createElement('td');
                           td5.colSpan="2";
                           td5.className="flex items-center justify-center";
                           var div4 = document.createElement('div');
                           div4.className="WagerStatistic BearRed";
                           div4.innerText= (parseFloat(ethers.utils.formatEther(bet.result)).toFixed(3)).toString();
                           div4.style.color="green";
                           var div41=document.createElement('div');
                           div41.className="NetworkCurrencySymbol active";
                           var img2=document.createElement('img');
                           img2.src="/Home/svmlogo.avif";
                           div41.appendChild(img2);
                           div4.appendChild(div41);
                           td5.appendChild(div4);
                           tablerow.appendChild(td5);
   
                           //Payment Part
   
                           if(bet.claimed){
                               //claimed
                               var td6 = document.createElement('td');
                               td6.colSpan="2";
                               var div5 = document.createElement('div');
                               div5.className="RoundClaim";
                               var p =document.createElement('p');
                               p.innerText="Claimed";
                               div5.appendChild(p);
                               td6.appendChild(div5);
                               tablerow.appendChild(td6);
                           }else if(!bet.claimed){
                               //claim refund
                               var td6 = document.createElement('td');
                               td6.colSpan="2";
                               var div5 = document.createElement('div');
                               div5.className="RoundClaim";
                               var p =document.createElement('div');
                               p.className="HistoryPageButton LegacyButton";
                               var button1 = document.createElement('button');
                               button1.appendChild(document.createTextNode("Claim Reward"));
                               button1.onclick = function () {
                                   // Call user_claimRound with the appropriate argument
                                   user_claimRound(bet.epoch);
                               };
                               p.appendChild(button1);
                               div5.appendChild(p);
                               td6.appendChild(div5);
                               tablerow.appendChild(td6);
                           }else{
                               //Do nothing
                           }
   
                       }else if(bet.position !== bet.closed){
                           // No Reward
                           var td5 = document.createElement('td');
                           td5.colSpan="2";
                           td5.className="flex items-center justify-center";
                           var div4 = document.createElement('div');
                           div4.className="WagerStatistic";
                           if(bet.closed!==0){
                               div4.innerText= 0.00;
                               div4.style.color="red";
                           }else if(bet.closed==0){
                               //Attend to it Later
                               div4.innerText= "Pending...";
                           }
                           var div41=document.createElement('div');
                           div41.className="NetworkCurrencySymbol active";
                           var img2=document.createElement('img');
                           img2.src="/Home/svmlogo.avif";
                           div41.appendChild(img2);
                           div4.appendChild(div41);
                           td5.appendChild(div4);
                           tablerow.appendChild(td5);
   
                           //Payment Part
                           var td6 = document.createElement('td');
                           td6.colSpan="2";
                           var div5 = document.createElement('div');
                           div5.className="RoundClaim";
                           var p =document.createElement('p');
                           if(bet.closed!==0){
                               p.innerText="No Reward";
                               div4.style.color="#ffffff";
                           }else if(bet.closed==0){
                               //Attend to it Later
                               p.innerText= "Pending...";
                           }
                           div5.appendChild(p);
                           td6.appendChild(div5);
                           tablerow.appendChild(td6);
   
   
                       }else{
                           // Do Nothing
                       }
                   }

                   document.getElementsByTagName('tbody')[0].appendChild(tablerow);

                   console.log(div4.innerText);
               });
           }else{
               console.log("Sorry You have not placed any bet");
           }
       }catch(e){
           console.log(e);
       }
                       }else{
                           //blinking...
                           document.getElementById('connect_button').classList.add('blinking');
                       }
                   }catch(e){
                       //Do nothing for now.
                       document.getElementById('connect-history').style.display='block';
                   }
       
               }catch(e){
                   console.log(e);
               }
           }
       }



   };

   if(window.ethereum){
       window.ethereum.on('accountsChanged', async (accounts)=>{
           //code here
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = await provider.getSigner();
       
           try{
               const address = await signer.getAddress();
               const balance = await provider.getBalance(address);
               document.getElementById('connect_button').innerText=(address).substring(0,5)+'...'+(address).substring((address.length)-5, (address).length);
               // document.getElementById('bnbBalance').innerText= balance+' BNB';
           }catch(e){
               //
               document.getElementById('not_conneted').style.display='block';
           }
         })
       
         window.ethereum.on('chainChanged', (chainId)=>{
           //code here
           if(chainId==93747){
               //Remove blinking...
               document.getElementById('connect_button').classList.remove('blinking');
           }else{
               //blinking...
               document.getElementById('connect_button').classList.add('blinking');
           }
         })
   }

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
               document.getElementById('connect-history').style.display='none';
               window.location.reload;
               // document.getElementById('bnbBalance').innerText= balance+' BNB';
   
               if(network.chainId==93747){
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

   async function claimAllRound(){
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       const network = await provider.getNetwork();

       try{
           const contract = new ethers.Contract(contractAdress, abi, signer);
           const myAddress = await signer.getAddress();
           const filter = contract.filters.Claim(myAddress);
   
           if(network.chainId==93747){
               try{
                   const txcn = await contract.claimAllRound();
                   const receipt = await txcn;
                   try{
                       await contract.on(filter, (sender, event)=>{
                           alert('All Round Claimed.');
                           location.reload();
                       })
                   }catch(e){
                       //
                       alert(e.data.message);
                   }
               }catch(e){
                   console.log(e);
               }
           }else{
               alert("You are not connected to the POLYGON Network. Click the blinking button at the top right to change Network.")
           }
       }catch(e){
           alert("Please connect your MetaMask")
       }
   }

   async function user_claimRound(epoch){
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = await provider.getSigner();
       const network = await provider.getNetwork();

       const contract = new ethers.Contract(contractAdress, abi, signer);
       // const epoch = document.getElementById("").nodeValue;
       const myAddress = await signer.getAddress();
       const filter = contract.filters.Claim(myAddress,null,null);

       if(network.chainId==93747){
           try{
               const txcn = await contract.user_claimRound(epoch);
               const receipt = await txcn;
               try{
                   await contract.on(filter, (sender, epoch, amount, event)=>{
                       location.reload();
                   })
               }catch(e){
                   alert(e.data.message);
               }
           }catch(e){
               console.log(e);
           }
       }else{
           alert("You are not connected to the POLYGON Network. Click the blinking button at the top right to change Network.")
       }

   }
     