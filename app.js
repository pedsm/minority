var express = require("express"),
	app = express()

const port = 3000

app.set('view engine', 'pug')
app.use(express.static('static'))
app.use(express.static('node_modules/startup.css/css'))
app.listen(port,()=> {
	console.log("Starting server on port "+ port)
})

app.get('/',(req,res)=>{
	res.render('index')
})
