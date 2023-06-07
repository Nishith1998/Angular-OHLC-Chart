var express = require('express'); 
var server = express();
var axios = require('axios');

server.set('port', 9000);
// Serve static directory where our angular app is located.
server.use(express.static(__dirname + '/dist/ohlc'));

server.use(express.json())


server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});

server.post('/api/getCandles', (req, res) => {
    console.log("this is req", req.body)
    let param = req.body;

    axios.get('https://api-pub.bitfinex.com/v2/candles/trade%3A' + param.timeFrame + '%3A'+ param.symbol + '/hist')
        .then(function (response) {
            // handle success
            res.send(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.json({error: "Technical Error"});
        })
        .finally(function () {
            // always executed
        });
})

server.get('/api/getAllSymbols', (req, res) => {
    axios.get('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL')
        .then(function (response) {
            // handle success
            res.send(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.json({error: "Technical Error"});
        })
        .finally(function () {
            // always executed
        });
})

