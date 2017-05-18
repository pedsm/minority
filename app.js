"use strict"
const port = 3000
const Game = require('./Game.js')
const Player = require('./Player.js').Player
const express = require("express"),
	app     = express(),
	http    = require('http').Server(app),
	io      = require('socket.io')(http)


//Global varaibles
var games = []
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
//find a specific game
function findGame(code) {
	return games.filter((game)=>{return game.getCode() == code})[0]
}
