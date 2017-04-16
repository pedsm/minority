var input  = document.getElementById("input")
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

function makeGame() {
	socket.emit('make', input.value)
	gameMaster = true;
	container.style.margin = "auto"
	makeBt.childNodes[0].innerHTML = "Nobody is in..."
	joinBt.style.display = "none"
}
function updateList() {
	playerlist.innerHTML = ""
	game.players.forEach((player)=>{
		playerlist.innerHTML += "<li>" + player.name + "</li>"
	})
}

socket.on('joined',(data)=> {
	game = data.game
	id = data.id
	player = game.players[id]
	console.log("Joined a room")
	updateList()
})