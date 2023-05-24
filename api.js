var express = require('express'); var server = express();
// var router = express.Router();
const axios = require('axios');

server.set('port', 3000);
// Serve static directory where our angular app is located.
server.use(express.static(__dirname + '/app'));

server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});

// server.get('/',(req, res) => {
//     console.log("adf");
//     res.json('asdf');
// })

server.get('/api/getCandles', (req, res) => {
    axios.get('https://api-pub.bitfinex.com/v2/candles/trade%3A1m%3AtBTCUSD/hist')
        .then(function (response) {
            // handle success
            // console.log(response.data);
            // resMapping.candleMapping(response.data);
            res.send(candleMapping(response.data))
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

const candleMapping = (data) => {
    return data.map(ele => {
        return {
            x: new Date(ele[0]),
            y: [ele[1], ele[2], ele[3], ele[4]]
        }
    })
}

