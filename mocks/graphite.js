'use strict';

var dgram = require('dgram');
var config = require('../config').client;
var metrics = {};
var server;
var address;


function start() {
    server = dgram.createSocket('udp4');

    server.on('listening', function onListening() {
        address = server.address();
        console.log('socket listening ' + address.address + ':' + address.port);
    });

    server.on('message', function (messages, remote) {
        messages.toString().split('\n').forEach(function onEach(message) {
            message = message.split(' ');
            if (!message[0]) {
                return;
            }
            if (!metrics[message[0]]) {
                metrics[message[0]] = 0;
            }
            metrics[message[0]] += parseInt(message[1]);
        });
    });

    server.on('close', function () {
        console.log('socket closed ' + address.address + ':' + address.port);
        start();
    });

    server.on('error', function () {
        console.log('socket error ' + address.address + ':' + address.port);
    });

    server.bind(config.port, config.host);
}

function stop() {
    server.close();
}

function print() {
    console.log(metrics);
}

start();

setInterval(print, 500);
