var express = require('express')

var port = process.env.PORT || 8080

var app = express()

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/Apps'))
app.use(express.static(__dirname + '/API'))
   
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Apps/index.html')
})

app.get('/cap-parser', function(req, res) {
    res.sendFile(__dirname + '/API/cap-parser.html')
})

app.listen(port, function() {
    console.log('Server running on port %s...', port)
});
