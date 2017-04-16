var input  = document.getElementById("input")
var input2 = document.getElementById("input2")
var makeBt = document.getElementById("button1")
var joinBt = document.getElementById("button2")
var container = document.getElementById("container")
var playerlist = document.getElementById("players")

var socket = io()
var game   = null
var player = null
var gameMaster = false
var id = null

//Listeners
makeBt.onclick = makeGame
joinBt.onclick = chooseName

function makeGame() {
	socket.emit('make', input.value)
	gameMaster = true;
	container.style.margin = "auto"
	makeBt.childNodes[0].innerHTML = "Nobody is in..."
	joinBt.style.display = "none"
}
function chooseName(){
	input.disabled = true
	input2.style.display = "block"
	makeBt.style.display = "none"
	joinBt.onclick = joinGame
}
function joinGame(){
	socket.emit('join', {name:input.value,room:input2.value})
}
function updateList() {
	playerlist.innerHTML = ""
	game.players.forEach((player)=>{
		playerlist.innerHTML += "<li>" + player.name + "</li>"
	})
}

socket.on('updateGame',(data)=>{
	game = data
	updateList()
})
socket.on('joined',(data)=> {
	game = data.game
	id = data.id
	player = game.players[id]
	console.log("Joined a room")
	updateList()
})