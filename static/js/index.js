var input  = document.getElementById("input")
var makeBt = document.getElementById("button1")
var joinBt = document.getElementById("button2")

var socket = io()
var game   = null
var player = null
var gameMaster = false
var id = null

//Listeners
makeBt.onclick = makeGame

function makeGame()
{
	socket.emit('make', input.value)
	gameMaster = true;
}

socket.on('joined',(data)=> {
	game = data.game
	id = data.id
	player = game.players[id]
	console.log("Joined a room")
})