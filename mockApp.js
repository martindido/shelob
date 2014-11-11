'use strict';

var PORT = 9002;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = 'hola.chau';

var i = 1;

setTimeout(onTimeout.bind({
    id: 'server1',
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 1
}), 600);
setTimeout(onTimeout.bind({
    id: 'server2',
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 2
}), 500);
setTimeout(onTimeout.bind({
    id: 'server3',
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 3
}), 400);

function onTimeout() {
    var buffer = new Buffer(this.id + '.' + message + ' ' + this.value);

    this.client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
        if (err) {
            throw err;
        }
        console.log(this.i, 'UDP message sent to ' + HOST +':'+ PORT);
        if (this.i >= 500) {
            return this.client.close();
        }
        this.i++;
        setTimeout(onTimeout.bind(this), 30);
    }.bind(this));
}
