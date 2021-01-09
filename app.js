var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 5500;
server.listen(port, () => {
    console.log("Listening server at port: " + port);
    console.log("open : http://localhost:" + port);
});

app.use(express.static("."));

app.get("/", function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('Socket connected...');
})