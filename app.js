const port = 3000
const express = require('express'),
	app = express()

// app.use(express.static('static'))
app.use(express.static('src'))

app.listen(port,()=>{
	console.log("Server running on port 3000")
})
