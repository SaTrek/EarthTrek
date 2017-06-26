var express = require('express')

var port = process.env.PORT || 9080

var app = express()

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/API'))
   
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/cap-parser', function(req, res) {
    res.sendFile(__dirname + '/API/cap-parser.html')
})
app.listen(port, function() {
    console.log('Server running on port %s...', port)
});
