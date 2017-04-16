var real  = document.getElementById("real")
var clone = document.getElementById("clone")
real.oninput = ()=>{
	console.log("Input")
	clone.value = real.value;
}