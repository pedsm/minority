var input  = document.getElementById("input")
var input2 = document.getElementById("input2")
var q1 = document.getElementById("q1")
var q2 = document.getElementById("q2")
var makeBt = document.getElementById("button1")
var joinBt = document.getElementById("button2")
var submitBt = document.getElementById("button3")
var container = document.getElementById("container")
var playerlist = document.getElementById("players")
var msg = document.getElementById("msg")
var gameView = document.getElementById("game")
var master = document.getElementById("master")
var ans1 = document.getElementById("ans1")
var ans2 = document.getElementById("ans2")
var msger = document.getElementById("msger")
var stats = document.getElementById("stats")

var socket = io()
var game   = null
var player = null
var gameMaster = false
var id = null
var lastR = null

//Listeners
makeBt.onclick = makeGame
joinBt.onclick = chooseName

//Makes a game
function makeGame() {
	socket.emit('make', input.value)
	gameMaster = true;
	container.style.margin = "auto"
	makeBt.childNodes[0].innerHTML = "Nobody is in..."
	makeBt.onclick = ()=> {}
	joinBt.style.display = "none"
	msg.style.display = "block";
}
//Chooses the name for anyone joining
function chooseName(){
	input.disabled = true
	input2.style.display = "block"
	makeBt.style.display = "none"
	joinBt.onclick = joinGame
}
//Joins an existing game after setting a name
function joinGame(){
	socket.emit('join', {name:input.value,room:input2.value})
	input.style.display = "none"
	input2.style.display = "none"
	joinBt.childNodes[0].innerHTML = "Wait for the start"
	joinBt.onclick = ()=>{}
}
//Updates the list as soon as someone joins
function updateList() {
	playerlist.innerHTML = ""
	game.players.forEach((player)=>{
		playerlist.innerHTML += "<li>" + player.name + "</li>"
	})
}
//Starts the game
function startGame() {
	container.style.display = "none"
	if(gameMaster){
		master.style.display = "block"
	}else{
		stats.style.display = "block"
	}
}
//reply question
function reply(value){
	lastR = value;
	socket.emit('reply',{value:value,code:game.code})
	msger.childNodes[0].innerHTML = "Waiting for other replies..."
}
//submit a question
button3.onclick = function (){
	socket.emit('question',{q1:q1.value,q2:q2.value, code:game.code})
}
//Update's the list of players on the waiting room
socket.on('updateGame',(data)=>{
	game = data
	if(game.round == 0)
	{
		updateList()
		// TODO: Remove this for actual production
		// if(game.players.length == 2) {
		// 	makeBt.childNodes[0].innerHTML = "You need more than 2"
		// }
		// if(game.players.length > 2) {
			makeBt.childNodes[0].innerHTML = "Everybody's in!"
			makeBt.onclick = ()=>{socket.emit('start',game.code)}
		// }
	}else{
		if(gameMaster == false)
		{
			container.style.display = "none"
			players.style.display = "none"
		}
	}
})
//Receives and stores the game state
socket.on('joined',(data)=> {
	game = data.game
	id = data.id
	player = game.players[id]
	console.log("Joined a room")
	msg.innerHTML = "Your room code: " + game.code
	updateList()
})
socket.on('start',(data)=>{
	startGame()
})
//receive question
socket.on('question',(data)=>{
	master.style.display = "none"
	stats.style.display = "none"
	gameView.style.display = "block"
	ans1.childNodes[0].innerHTML = data.q1
	ans2.childNodes[0].innerHTML = data.q2
	ans1.onclick = ()=>{reply(0)}
	ans2.onclick = ()=>{reply(1)}
	msger.childNodes[0].innerHTML = ""
})
