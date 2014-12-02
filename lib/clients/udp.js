'use strict';

var dgram = require('dgram');
var async = require('async');

module.exports = Udp;

function Udp(options) {
    options = options || {};
    this.host = options.host;
    this.port = options.port;
    this.start();
}

Udp.prototype.start = function start() {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
}

Udp.prototype.onClose = function onClose() {
    console.log('socket closed ' + this.host + ':' + this.port);
    this.start();
};

Udp.prototype.onError = function onError(err) {
    console.log('socket error ' + this.host + ':' + this.port + ' - ' + err);
};

Udp.prototype.send = function send(metrics) {
    this.stringify(metrics || {}, function callback(message) {
        if (!message) {
            return;
        }
        message = new Buffer(message);
        this.socket.send(message, 0, message.length, this.port, this.host, function sent(err, bytes) {
            console.log('UDP message sent to ' + this.host +':'+ this.port);
            console.log(message.toString());
        }.bind(this));
    }.bind(this));
};

Udp.prototype.stringify = function stringify(metrics, callback) {
    var message = '';

    async.each(Object.keys(metrics), each.bind(this), done);

    function each(metric, callback) {
        message += metric + ' ' + metrics[metric] + ' ' + this.now() + '\n';
        callback();
    }

    function done(err) {
        callback(message);
    }
};

Udp.prototype.now = function now() {
    return String((new Date()).getTime()).substr(0, 10);
}
