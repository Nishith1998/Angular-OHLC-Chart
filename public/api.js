var express = require('express'); var server = express();
// var router = express.Router();
const axios = require('axios');

server.set('port', process.env.PORT || 3000);
// Serve static directory where our angular app is located.
server.use(express.static(__dirname + '/dist/ohlc'));

server.use(express.json())
  

server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});

// server.get('/',(req, res) => {
//     console.log("adf");
//     res.json('asdf');
// })

server.post('/api/getCandles', (req, res) => {
    console.log("this is req", req.body)
    let param = req.body;

    axios.get('https://api-pub.bitfinex.com/v2/candles/trade%3A' + param.timeFrame + '%3A'+ param.symbol + '/hist')
        .then(function (response) {
            // handle success
            // console.log(response.data);
            // resMapping.candleMapping(response.data);
            res.send(response.data) // candleMapping(response.data)
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
            // console.log(response.data);
            // resMapping.candleMapping(response.data);
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

// const candleMapping = (data) => {
//     return data.map(ele => {
//         return {
//             x: new Date(ele[0]),
//             y: [ele[1], ele[2], ele[3], ele[4]]
//         }
//     })
// }

