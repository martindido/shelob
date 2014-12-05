'use strict';

var dgram = require('dgram');
var async = require('async');

module.exports = Server;

function Server(options) {
    options = options || {};
    this.host = options.host;
    this.port = options.port;
    this.interval = options.interval;
    this.intervalCallback = options.intervalCallback || function noop() {};
    this.clients = {};
    this.metrics = {};
}

Server.prototype.start = function start() {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('listening', this.onListening.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.bind(this.port, this.host);
    setInterval(this.onInterval.bind(this), this.interval);
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
    //console.log('socket message ' + remote.address + ':' + remote.port +' - ' + message);
};

Server.prototype.addClient = function addClient(client) {
    this.clients[client.constructor.name] = client;
};

Server.prototype.removeClient = function addClient(client) {
    client = typeof client === 'string' ? client : client.constructor.name;
    delete this.clients[client];
};

Server.prototype.onInterval = function onInterval() {
    async.each(Object.keys(this.clients), function each(client, callback) {
        this.clients[client].send(this.metrics);
        callback();
    }.bind(this), function callback(err) {
        this.metrics = {};
        this.intervalCallback(err);
    }.bind(this));
}
