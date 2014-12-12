'use strict';

var dgram = require('dgram');
var async = require('async');
var METHODS = {
    INCREMENT: 'i',
    DECREMENT: 'd',
    GAUGE: 'g'
};
var SEPARATORS = {
    SPACE: '_',
    KEY: '.',
    MESSAGE: ':'
};
var rSpace = / /g;

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

Server.prototype.METHODS = METHODS;

Server.prototype.SEPARATORS = SEPARATORS;

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
    var key;
    var value;
    var method;

    if (!message) {
        return;
    }
    message = message.toString().split(this.SEPARATORS.MESSAGE);
    key = message[0].toLowerCase().replace(rSpace, this.SEPARATORS.SPACE);
    value = parseFloat(message[1]);
    method = message[2];
    if (!this.metrics[key]) {
        this.metrics[key] = 0;
    }
    switch(method) {
        case this.METHODS.GAUGE:
            this.metrics[key] = value;
        break;
        case this.METHODS.DECREMENT:
            this.metrics[key] -= value;
        case this.METHODS.INCREMENT:
        default:
            this.metrics[key] += value;
        break;
    }
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
