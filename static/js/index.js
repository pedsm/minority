var input  = document.getElementById("input")
var input2 = document.getElementById("input2")
var makeBt = document.getElementById("button1")
var joinBt = document.getElementById("button2")
var container = document.getElementById("container")
var playerlist = document.getElementById("players")
var msg = document.getElementById("msg")

var socket = io()
var game   = null
var player = null
var gameMaster = false
var id = null

//Listeners
makeBt.onclick = makeGame
joinBt.onclick = chooseName

//Makes a game
function makeGame() {
	socket.emit('make', input.value)
	gameMaster = true;
	container.style.margin = "auto"
	makeBt.childNodes[0].innerHTML = "Nobody is in..."
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
	
}
//Update's the list of players on the waiting room
socket.on('updateGame',(data)=>{
	game = data
	updateList()
	if(game.players.length == 2) {
		makeBt.childNodes[0].innerHTML = "You need more than 2"
	}
	if(game.players.length > 2) {
		makeBt.childNodes[0].innerHTML = "Everybody's in!"
		startGame()
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