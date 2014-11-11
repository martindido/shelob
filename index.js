'use strict';

var dgram = require('dgram');
var async = require('async');
var config = require('./config');
var metrics = {};
var server;
var client;
var address;


function start() {
    server = dgram.createSocket('udp4');
    client = dgram.createSocket('udp4');

    server.on('listening', function onListening() {
        address = server.address();
        console.log('socket listening ' + address.address + ':' + address.port);
    });

    server.on('message', function onMessage(message, remote) {
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

    server.on('close', function onClose() {
        console.log('socket closed ' + address.address + ':' + address.port);
        start();
    });

    server.on('error', function onError() {
        console.log('socket error ' + address.address + ':' + address.port);
    });

    server.bind(config.server.port, config.server.host);
}

function stop() {
    server.close();
    client.close();
}

function send() {
    async.each(Object.keys(metrics), function onEach(metric, callback) {
        var message = new Buffer(metric + ' ' + metrics[metric]);

        delete metrics[metric];
        client.send(message, 0, message.length, config.client.port, config.client.host, function(err, bytes) {
            console.log('UDP message sent to ' + config.client.host +':'+ config.client.port + ' - ' + message);
        });
        callback();
    });
}

start();

setInterval(send, 500);
