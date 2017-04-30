var connect = require('connect');
var serveStatic = require('serve-static');

var port = process.env.PORT || 8080

connect().use(serveStatic(__dirname))
    .use(function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    })
    .listen(port, function() {
        console.log('Server running on port %s...', port);
    });
