let stopListening = false;

console.log("starting...");


async function startLoop(){
    try {
        console.log("inside start loop");
        while(!stopListening){
            console.log(stopListening);
            try {
                console.log("starting promise");
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log("resolving..");
                        resolve();
                    }, 6000);
                })
            } catch (error) {
                console.log("error occured.... cancelled");
            }
        }
    } catch (error) {
        console.log("error occured cancelling...");
    }
}


function change(){
    console.log("change started..");
    setTimeout(() => {
        stopListening=true;
        console.log("stop listening set to true");
    }, 2000);
}

change();
startLoop();