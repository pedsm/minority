"use strict"
const port = 3000
var express = require("express"),
	app     = express(),
	http    = require('http').Server(app),
	io      = require('socket.io')(http)

//Global varaibles
var games = []
var curGame = 0;

app.set('view engine', 'pug')
app.use(express.static('static'))
app.use(express.static('node_modules/startup.css/css'))
app.use(express.static('node_modules/socket.io-client/dist'))
http.listen(port,()=> {
	console.log("Starting server on port "+ port)
})

app.get('/',(req,res)=>{
	res.render('index')
})

//Real time stuff
io.on('connection',(socket)=> {
	console.log("Connection Made.");
	//User selected a name
	socket.on('make',(data)=>{
		var tmpP = new Player();
		var tmp = new Game();
		var id = tmp.addPlayer(tmpP)
		games.push(tmp)
		console.log("Game created:"+tmp.getCode())
		socket.emit('joined',{game:tmp, id:id})
	})
	socket.on('disconnect',()=>
	{
		console.log("Connection Dropped")
	})
})

//Logic stuff
class Game {
	constructor(){
		this.code = generateCode()
		this.players = []
		//round 0 indicates a game that has not started
		this.round = 0
	}
	addPlayer(pl){
		this.players.push(pl)
		return this.players.length - 1 
	}
	getCode(){
		return this.code;
	}
}

class Player {
	constructor(name) {
		this.name = name
		this.score = 0
		this.plays = 0
	}
}
function generateCode()
{
	var code = [0,0,0,0]
	code[3] = curGame%26
	code[2] = (Math.floor(curGame/26))%26
	code[1] = (Math.floor(curGame/(26*26)))%26
	code[0] = (Math.floor(curGame/(26*26*26)))%26
	curGame++;
	var s = "";
	code.forEach((letter)=>{
		s += String.fromCharCode(65+letter)
	})
	return s
	// return "AAAA";
}
//find a specific game
function findGame(code) {
	return games.filter((game)=>{return game.getCode == code})
}