const express = require('express')

const merger = require('./API/data-merger')

const port = process.env.PORT || 9080

const app = express()

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/Apps'))
app.use(express.static(__dirname + '/API'))
   
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Apps/index.html')
})

app.get('/api/cap-parser', function(req, res) {
    res.sendFile(__dirname + '/API/cap-parser.html')
})

app.get('/api/merge', function(req, res) {
    try {
        merger.mergeData()
        res.end()
    }
    catch(err){
        res.status(500).end(err)
    }
})

app.post('/api/merge', function(req, res) {
    try {
        merger.mergeData(req.body)
        res.end()
    }
    catch(err){
        res.status(500).end(err)
    }
})

app.listen(port, function() {
    console.log('Server running on port %s...', port)
});
