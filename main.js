var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser')

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
var args = process.argv.slice(2);
var port = args[0] || 8080;
var userName = args[1] || "Alice";
var receiverPort = args[2];
var p = 23;
var g = 5;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var secret = getRandomInt(g, p);
console.log("my secret is "+ secret);

app.get('/', function (req, res) {
    res.send('Welcome to deffie hellman secret key exchange ' + userName+".  modulus p = "+p+ " and base g = "+5);
});

app.get('/send', function (req, res) {
    var myPublicKey =  (g**secret) % p;
    console.log("my public key "+ myPublicKey);
    const headers = {
        'Content-Type': 'application/json'
      }
      
    axios.post('http://localhost:'+receiverPort+"/receive", {
        pubKey: myPublicKey,
        sender: userName
      },{
        headers: headers
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    
    res.send('myPublicKey');
});

app.post('/receive', function (req, res) {
    console.log(req.body);
    var sec =  (req.body.pubKey**secret) % p;
    console.log ("shared secret key is "+ sec);
    res.send('Received pubkey');
});

app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});
