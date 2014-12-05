'use strict';

var dgram = require('dgram');
var config = require('../config').server;
var message = 'test.foo';

setTimeout(onTimeout.bind({
    id: 'server4',
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 1
}), 600);
/*setTimeout(onTimeout.bind({
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
}), 400);*/

function onTimeout() {
    var buffer = new Buffer(this.id + '.' + message + ':' + this.value);

    this.client.send(buffer, 0, buffer.length, config.port, config.host, function(err, bytes) {
        if (err) {
            throw err;
        }
        console.log(this.i, 'UDP message sent to ' + config.host +':'+ config.port);
        if (this.i >= 500) {
            return this.client.close();
        }
        this.i++;
        setTimeout(onTimeout.bind(this), 30);
    }.bind(this));
}
