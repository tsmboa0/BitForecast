const WebSocket = require('ws');
const axios = require("axios");


console.log("starting...")

setInterval(async()=>{
	// console.log("Live BTCUSDT price signal received");
	//
	await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
	.then(async(response) => {
		// Extract and use the price from the response
		console.log("price stage passed.")
		const btc_usdt = response.data.price;
		console.log("the BTCUSDT Price is "+btc_usdt);

		//emit price to frontend.
		// io.emit("btc_usdt", btc_usdt);
		console.log("LivePrice Emitted...");
	})
	.catch((e)=>{
		console.log(e," getBnbPrice didnt work out");
	})
},500);

// setInterval(() => {
	// console.log("The price of btc now is ",tradeData);
// }, 3000);