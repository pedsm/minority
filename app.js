const express = require("express"),
	  app = express()

const port = 3000

app.set('view engine', 'pug')
app.listen(port,()=> {
	console.log("Starting server on port "+ port)
})

app.get('/',(req,res)=>{
	res.render('index')
	// res.send("Hello World!")
})