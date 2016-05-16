'use strict';
const net = require('net');
const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');

var d = [];

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// io.on('connection', function(){ /* … */ });

app.use(require('express').static(__dirname + "/public"));
app.get("/", (req, res) => {
    res.sendfile(__dirname + "/index.html");
});
app.get("/builder", (req, res) => {
    res.sendfile(__dirname + "/gear.html");
});

io.on("connection", function(client){
    client.emit("data", d);
    client.on("change", function(kv) {
        d[kv.k] = kv.v;
        io.emit("cc", kv);
    });
});

server.listen(7777);
