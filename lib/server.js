'use strict';

var dgram = require('dgram');

module.exports = Server;

function Server(options) {
    this.host = options.host;
    this.port = options.port;
    this.metrics = {};
    this.start();
}

Server.prototype.start = function start() {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('listening', this.onListening.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.bind(this.port, this.host);
};

Server.prototype.onListening = function onListening() {
    console.log('socket listening ' + this.host + ':' + this.port);
};

Server.prototype.onClose = function onClose() {
    console.log('socket closed ' + this.host + ':' + this.port);
    this.start();
};

Server.prototype.onError = function onError(err) {
    console.log('socket error ' + this.host + ':' + this.port + ' - ' + err);
};

Server.prototype.onMessage = function onMessage(message, remote) {
    var metric;
    var value;

    if (!message) {
        return;
    }
    message = message.toString().split(':');
    metric = message[0].toLowerCase();
    value = parseInt(message[1]);
    if (!this.metrics[metric]) {
        this.metrics[metric] = 0;
    }
    this.metrics[metric] += parseInt(value);
    console.log('socket message ' + remote.address + ':' + remote.port +' - ' + message);
};
