'use strict';

var PORT = 9003;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var metrics = {};
var server;
var address;


function start() {
    server = dgram.createSocket('udp4');

    server.on('listening', function onListening() {
        address = server.address();
        console.log('socket listening ' + address.address + ':' + address.port);
    });

    server.on('message', function (message, remote) {
        message = message.toString().split(' ');
        if (message.length !== 2) {
            return;
        }
        if (!metrics[message[0]]) {
            metrics[message[0]] = 0;
        }
        metrics[message[0]] += parseInt(message[1]);
        console.log(remote.address + ':' + remote.port +' - ' + message[0] + ' : ' + message[1]);
    });

    server.on('close', function () {
        console.log('socket closed ' + address.address + ':' + address.port);
        start();
    });

    server.on('error', function () {
        console.log('socket error ' + address.address + ':' + address.port);
    });

    server.bind(PORT, HOST);
}

function stop() {
    server.close();
}

function print() {
    console.log(metrics);
}

start();

setInterval(print, 500);
