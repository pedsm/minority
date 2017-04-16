"use strict"
const port = 3000
var express = require("express"),
	app     = express(),
	io      = require('socket.io')(port+1)

//Global varaibles
var games = []
var curGame = 0;

app.set('view engine', 'pug')
app.use(express.static('static'))
app.use(express.static('node_modules/startup.css/css'))
app.listen(port,()=> {
	console.log("Starting server on port "+ port)
})

app.get('/',(req,res)=>{
	res.render('index')
})
app.get('/make',(req,res)=>{
	var tmp = new Game()
	games.push(tmp)
	console.log("New game with code " + tmp.getCode() + " started")
	console.log("Current games:" + games.length)
	res.render('make',{code : tmp.getCode(), name:req.query.name})
})

//Logic stuff
class Game {
	constructor(){
		this.code = generateCode()
		this.players = []
		this.round = 1
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