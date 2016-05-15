'use strict';
const net = require('net');
const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// io.on('connection', function(){ /* … */ });

app.use(require('express').static(__dirname + "/public"));
app.get("/", (req, res) => {
    res.sendfile(__dirname + "/index.html");
});
server.listen(7777);
