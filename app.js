// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());

const port = 7000;

var bodyParser = require('body-parser');
app.use(bodyParser.json ());
app.use(bodyParser.urlencoded({
    extended: true
}));

var buscaCep = require('busca-cep');
var sinesp = require('sinesp-nodejs');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//BUSCA A PLACA
app.get('/buscarPlaca', function(req, res)
{
	sinesp.consultaPlaca('AAA0001').then(dados => 
	{
		res.header('Content-type','application/json');
		res.header('Charset','utf8');
		res.send(req.query.callback + '('+ JSON.stringify(dados) + ');');
	}).catch(err => 
	{
		console.log(err);
	});
});

//BUSCA O CEP
app.get('/buscarCep', function(req, res)
{	
	buscaCep('81220-190', {sync: false, timeout: 1000}).then(endereco => 
	{ 
		res.header('Content-type','application/json');
		res.header('Charset','utf8');
		res.send(req.query.callback + '('+ JSON.stringify(endereco) + ');');
	}).catch(erro => 
	{
		console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
	});	
});

app.get('/endpoint', function(req, res){
	var obj = {};
	obj.title = 'title';
	obj.data = 'data';
	
	console.log('params: ' + JSON.stringify(req.params));
	console.log('body: ' + JSON.stringify(req.body));
	console.log('query: ' + JSON.stringify(req.query));
	
	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
});

// listen for requests :)
var listener = app.listen(port /*process.env.PORT*/, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
