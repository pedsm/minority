"use strict"
const port = 3000
var express = require("express"),
	app     = express(),
	http    = require('http').Server(app),
	io      = require('socket.io')(http)

//Global varaibles
var games = []
var curGame = 0
var ids = 0 

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
	socket.cid = ids++
	console.log("Connection Made.");
	//User selected a name and made a game
	socket.on('make',(data)=>{
		var ptmp = new Player(data,socket.id)
		console.log(ptmp)
		var tmp = new Game();
		var id = tmp.addPlayer(ptmp)
		games.push(tmp)
		console.log("Game created:"+tmp.getCode())
		socket.emit('joined',{game:tmp, id:id})
	})
	//user is joining a game
	socket.on('join',(data)=>{
		var ptmp = new Player(data.name,socket.id)
		var tmp = findGame(data.room)
		tmp.addPlayer(ptmp)
		console.log(tmp)
		// var id = tmp.addPlayer(ptmp)
		// TODO: Add error checking
		tmp.updateList();
	})
	socket.on('start',(data)=>{
		var tmp = findGame(data);
		tmp.start();
	})
	socket.on('question',(data)=>{
		var tmp = findGame(data.code)
		tmp.question(data)
	})
	socket.on('reply',(data)=>{
		var tmp = findGame(data.code)
		tmp.replies.push(data.value)
		if(tmp.replies.length == tmp.players.length){
			tmp.results();
		}
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
		this.replies = []
	}
	addPlayer(pl){
		this.players.push(pl)
		return this.players.length - 1 
	}
	getCode(){
		return this.code;
	}
	//Updates current player list
	updateList() {
		this.players.forEach((player)=>{
			io.sockets.connected[player.cid].emit('updateGame',this)
		})
	}
	start(){
		this.players.forEach((player)=>{
			io.sockets.connected[player.cid].emit('start')
		})
	}
	question(q)
	{
		this.round++
		console.log(q)
		this.players.forEach((player)=>{
			io.sockets.connected[player.cid].emit('question',q)
		})
	}
	results(){
		var avg = this.replies.reduce((ac,val)=>{return ac+val})/this.players.length
		this.players.forEach((player)=>{
			io.sockets.connected[player.cid].emit('result',avg)
			this.replies = []
		})
	}
}

class Player {
	constructor(name,cid) {
		this.name = name
		this.score = 0
		this.plays = 0
		this.cid = cid
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
	return games.filter((game)=>{return game.getCode() == code})[0]
}