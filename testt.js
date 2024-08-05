async function getReload1(){
	// await Client.connect();
	// await Client.flushdb();
	// await Client.FLUSHALL();
	// console.log("all info cleared..");
	// await Client.set("LockAutomateSignal", 'true');

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

	const bet_odds1 = await Client.hgetall("Betodds1");
	currentBullOdd1 = bet_odds1.currentBullOdd;
	currentBearOdd1 = bet_odds1.currentBearOdd;
	nextPricePool1 = bet_odds1.nextPricePool;

	const end_round1 = await Client.hgetall("EndRound1");
	previousPricePool1 = end_round1.previousPricePool;
	previousLockedPrice1 = end_round1.previousLockedPrice;
	previousEpoch1 = end_round1.previousEpoch;
	wonOdd1 = end_round1.wonOdd;

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