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

async function Check(){
    //check if a user is already connected and check network.
    if(window.ethereum){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();

            try{
                const address = await signer.getAddress();
                document.getElementById('not_connected').style.display='none';
                document.getElementById('connect_button').style.display='block';
                document.getElementById('connect_button').innerText=(address).substring(0,5)+'...'+(address).substring((address.length)-5, (address).length);
    
                //detect network.
                const network = await provider.getNetwork();
                if(network.chainId==137){
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
        if(chainId==137){
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
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Corrected to '0x38' for BSC mainnet
        });
        document.getElementById('disconnectModal').style.display='none';
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum-compatible wallet.');
    }
  }

  async function injectFunds(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);
        const value = document.getElementById('fundsValue').value;
        const param = {value: ethers.utils.parseUnits(value.toString(), 18)};

        if(network.chainId==137){
            try{
                const tx = await contract.FundsInject(param);
                await contract.on("InjectFunds", (sender, event) => {
                    alert("A new Round Has startted ");
                });
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function extractFunds(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);
        const value = ethers.utils.parseEther(document.getElementById('fundsValue').value.toString());
        const param = {value: value};
        console.log(param.value);

        if(network.chainId==137){
            try{
                const tx = await contract.FundsExtract(param.value);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function pauseContract(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.Pause();
                await contract.on("ContractPaused_", (epoch, event)=>{
                    //
                    alert("Contract pasued for Round ",epoch);
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function unpauseContract(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.Unpause();
                await contract.on("ContractUnpaused_", (epoch, event)=>{
                    //
                    alert("Contract Unpasued for Round ",epoch);
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function setOperator(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const operatorAddress = document.getElementById('operatorAddress').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.SetOperator(operatorAddress);
                document.getElementById('setOperatorModal').style.display='none';
                alert("New Operator Set", operatorAddress);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function setRewardRate(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const newRate = document.getElementById('newRewardRate').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.SetRewardRate(newRate);
                document.getElementById('setRewardRateModal').style.display='none';
                console.log("New Reward Rate  Set", newRate);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function blacklistUser(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const user = document.getElementById('blacklistAdd').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.BlackListInsert(user);
                document.getElementById('blacklistModal').style.display='none';
                console.log("User ", user, " has been blacklisted.");
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function removeFromBlacklist(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const user = document.getElementById('blacklistRemove').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.BlackListRemove(user);
                document.getElementById('blacklistRemoveModal').style.display='none';
                console.log("User ", user, " has been removed from blacklist.");
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function rewardUser(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const user = document.getElementById('rewardAddress').value;
        const amount = ethers.utils.parseEther(document.getElementById('rewardAmount').value.toString());
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.RewardUser(user,amount);
                document.getElementById('rewardUserModal').style.display='none';
                console.log("User ", user, " has been rewarded with ",amount);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function RoundCancel(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const epoch = document.getElementById('cancelEpoch').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.RoundCancel(epoch, true, true);
                await contract.on("CancelRound", (epoch, event)=>{
                    document.getElementById('cancelModal').style.display='none';
                    console.log("Round ", epoch, " Canceled.");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function startRound(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.RoundStart();
                await contract.on("StartRound", (epoch, roundTimestamp, event)=>{
                    console.log("Round ", epoch.toNumber(), " Started.");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function lockRound(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const price = ethers.utils.parseEther(document.getElementById('lockPrice').value.toString());
        const timestamp = document.getElementById('timestamp').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.RoundLock(price, timestamp);
                await contract.on("LockAutomate", (event)=>{
                    console.log("LockAutomate Emitted.");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function setMinBetAmount(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const min = ethers.utils.parseEther(document.getElementById('minBetAmount').value.toString());
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.SetMinBetAmount(min);
                await contract.on("MinBetAmountUpdated", (currentEpoch, minBetAmount, event)=>{
                    document.getElementById('setMinBetAmountModal').style.display='none';
                    console.log("New Min Bet Amount Set");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function setRoundInterval(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const interval = document.getElementById('roundInterval').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.SetRoundInterval(interval);
                await contract.on("RoundIntervalUpdated", (newInterval, event)=>{
                    document.getElementById('setRoundIntervalModal').style.display='none';
                    console.log("New Round Interval Set");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function minbetamount(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try{
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const contract = new ethers.Contract(contractAdress, abi, signer);
    
            if(network.chainId==137){
                try{
                    const tx = await contract.minBetAmount();
                    alert("Minimum Bet amount is "+(ethers.utils.formatEther(tx))+'BNB');
                }catch(err){
                    alert(err.data.message);
                }
            }else{
                //Change to POLYGON Network
                alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
            }
        }catch(e){
            alert("Please Connect to MetaMask First. Click the conect button in the top right corner.")
        }

    }
  }

  async function _rounds(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const epoch = document.getElementById('roundEpoch').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract._Rounds(epoch);
                alert(
                    "Bull Amount: "+ethers.utils.formatEther(tx.bullAmount)+"\n"+
                    "Bear Amount: "+ethers.utils.formatEther(tx.bearAmount)+"\n"+
                    "Lock Price:  "+ethers.utils.formatEther(tx.lockprice)+"\n"+
                    "End Price:   "+ethers.utils.formatEther(tx.endprice)+"\n"+
                    "Start TimeStamp: "+tx.startTimestamp+"\n"+
                    "Rewards Claimable: "+ethers.utils.formatEther(tx.rewardsClaimable)+"\n"+
					"Won Odd    "+ethers.utils.formatEther(tx.wonOdd)+"\n"+
                    "isbullwon:   "+tx.isbullwon+"\n"+
                    "isbearwon:    "+tx.isbearwon+"\n"+
                    "istie:        "+tx.istie+"\n"+
                    "Closed:       "+tx.closed+"\n"+
                    "Canceled:     "+tx.canceled+"\n"
                );
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function bets(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const epoch = document.getElementById('betsEpoch').value;
        const addr = document.getElementById('betsAddress').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.Bets(epoch,addr);
                alert(
                    "Position: "+tx.position+"\n"+
                    "Bet Amount: "+tx.amount+"\n"+
                    "Claimed:  "+tx.claimed+"\n"+
                    "isbet:   "+tx.isbet+"\n"
                );
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function currentEpoch(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.currentEpoch();
                alert("The Current epoch is #"+tx);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function operatorAddress(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.operatorAddress();
                alert("The Operator Address is: "+tx);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function ownerAddress(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.owner();
                alert("The Owner Address is: "+tx);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function minimumRewardRate(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.minimumRewardRate();
                alert("The Minimum Reward Rate is: "+tx);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function rewardRate(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.rewardRate();
                alert("The Reward Rate is: "+tx);
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function roundInterval(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.roundInterval();
                alert("The Round Interval is: "+tx+"s");
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function userBets(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const addr = document.getElementById('userBetsAddress').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.UserBets(addr);
                alert(tx)
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function forceExecute(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const price = ethers.utils.parseEther(document.getElementById('executeLock').value.toString());
        const bull = ethers.utils.parseEther(document.getElementById('executeBull').value.toString());
        const bear = ethers.utils.parseEther(document.getElementById('executeBear').value.toString());
        const timestamp = Math.floor((new Date().getTime())/1000);
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.ForceExecute(price, timestamp, bull, bear);
                await contract.on("StartRound", (epoch, roundTimestamp, event)=>{
                    console.log("Force Execution Complete.");
                })
            }catch(err){
                alert(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }

  async function setWallets(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const devWallet = document.getElementById('devWallet').value;
        const ownerWallet = document.getElementById('ownerWallet').value;
        const othersWallet = document.getElementById('othersWallet').value;
        const contract = new ethers.Contract(contractAdress, abi, signer);

        if(network.chainId==137){
            try{
                const tx = await contract.SetWallets('0x64772107fC23f7370C90EA0aBd29ee6117B97f77', ownerWallet, othersWallet);
            }catch(err){
                alert(err.data.message);
				console.log(err.data.message);
            }
        }else{
            //Change to POLYGON Network
            alert("You are not connected to POLYGON Network. Click the blinking button at the top right to switch to POLYGON Network");
        }

    }
  }