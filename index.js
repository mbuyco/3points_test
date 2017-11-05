const express    = require('express');
const http       = require('http');
const app        = express();
const bodyParser = require('body-parser');
const port       = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World');
	res.end();
});

app.get('/api/weather', (req, res) => {
	var weatherAPIKey = '3d23d85e4d1e37b070c1640446fd3046';
	var getURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + req.query.zipcode + ',ph&APPID=' + weatherAPIKey + '&units=metric';

	http.get(getURL, (getRes) => {
		let error            = false;
		const { statusCode } = getRes;

		if(statusCode !== 200)
			error = true;

		if(error) {
			res.send('Request failed');
			getRes.resume();
			return;
		}

		getRes.setEncoding('utf8');

		let data = '';

		getRes.on('data', (chunk) => data += chunk);

		getRes.on('end', () => {
			try {
				const parsedData = JSON.parse(data);
				const { description } = parsedData.weather[0];
				const { temp, humidity } = parsedData.main;
				const { speed } = parsedData.wind;
				const cityName = parsedData.name;
				const msg = `
					<b>Description:</b> ${description}<br>
					<b>Temp:</b> ${temp}&#8451;<br>
					<b>Humidity:</b> ${humidity}%<br>
					<b>Wind Speed:</b> ${speed}<br>
					<b>Name of the city:</b> ${cityName}
				`;

				res.send(msg);
			}
			catch(e) {
				console.error(e.message);
				res.send('Request failed');
			}

			res.end();
		});

	}).end();
});

app.listen(port, () => console.log('Listening on port 3000'));