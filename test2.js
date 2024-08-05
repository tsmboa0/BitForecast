const axios = require('axios');

const HEROKU_API_KEY = 'HRKU-a7c87b3d-2fb2-4dc8-9073-211aa196bcb1'; // Replace with your Heroku API key
const APP_NAME = 'BitForecast'; // Replace with your Heroku app name

const restartDyno = async () => {
    console.log("restarting dyno...");
    try {
        const response = await axios.delete(
            `https://api.heroku.com/apps/${APP_NAME}/dynos`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.heroku+json; version=3',
                    'Authorization': `Bearer ${HEROKU_API_KEY}`,
                },
            }
        );
        console.log('Dyno restarted:', response.data);
    } catch (error) {
        console.error('Error restarting dyno:', error.response ? error.response.data : error.message);
    }
};