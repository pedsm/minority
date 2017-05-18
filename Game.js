"use strict"
var curGame = 0;
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
}
module.exports = Game
