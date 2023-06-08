const express = require('express'); 
const server = express();
const axios = require('axios');

server.set('port', 9000);
server.use(express.static(__dirname + '/dist/ohlc'));

server.use(express.json())


server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});

server.get('/api/getCandles', (req, res) => {
    let param = req.query;

    axios.get('https://api-pub.bitfinex.com/v2/candles/trade%3A' + param.timeFrame + '%3A'+ param.symbol + '/hist')
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
            res.json({error: "Technical Error"});
        })
})

server.get('/api/getAllSymbols', (req, res) => {
    axios.get('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL')
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
            res.json({error: "Technical Error"});
        })
})

