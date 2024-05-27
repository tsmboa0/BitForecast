console.log("less than, querying historic events from the blockchain...");
			nextEpoch0 = parseInt(nextEpoch0);
			const endEpoch = (nextEpoch0 - 1).toString();
			const missedEpoch = (nextEpoch0 + 1).toString();
			console.log("Missed Epoch is : "+missedEpoch);
			const startround_filter = contract.filters.StartRound(null, null);
			const lockedround_filter = contract.filters.LockRound(null, null,null,null);
			const endround_filter = contract.filters.EndRound(null, null,null,null);
			const betodds_filter = contract.filters.Betodds(null,null,null);
			
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
							await Client.hSet("StartRound0", {
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
							await Client.hSet('EndRound', {
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
							// currentPricePool = parseFloat(ethers.formatEther(result1.args.pool.toString())).toFixed(2);
							previousBullOdd = parseFloat(ethers.formatEther(result1.args.bullAmount.toString())).toFixed(2);
							previousBearOdd = parseFloat(ethers.formatEther(result1.args.bearAmount.toString())).toFixed(2);
						
							//store data on redis
							await Client.hSet('LockRound', {
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
							currentBullOdd = parseFloat(ethers.formatEther(result3.args.bullAmount.toString())).toFixed(2);
							console.log("current bull odd is "+result3.args.currentBearOdd);
							currentBearOdd = parseFloat(ethers.formatEther(result3.args.Amount.toString())).toFixed(2);
							nextPricePool = parseFloat(ethers.formatEther(result3.args.pool.toString())).toFixed(2);
						
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