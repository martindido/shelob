'use strict';

var dgram = require('dgram');
var _ = require('underscore');
var config = require('../config').server;
var message = 'test.foo';
var rCountry = /[a-z]{3}/;
var countries = _.uniq(require('./world.json').features.map(function each(country) {
    return country.id.toLowerCase()
})).filter(function each(country) {
    return rCountry.test(country);
}).sort();

setInterval(onInterval.bind({
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 1
}), 2000);
setInterval(onInterval.bind({
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 2
}), 4000);
setInterval(onInterval.bind({
    client: dgram.createSocket('udp4'),
    i: 1,
    value: 3
}), 3000);

function onInterval() {
    this.id = 'server' + (Math.floor((Math.random() * 100) + 1));

    var buffer = new Buffer(this.id + '.' + _.sample(countries) + '.' + message + ':' + this.value);

    this.client.send(buffer, 0, buffer.length, config.port, config.host, function(err, bytes) {
        if (err) {
            throw err;
        }
        console.log(this.i, buffer.toString() + ' sent to ' + config.host +':'+ config.port);
        if (this.i >= 50) {
            this.i = 1;
            return;
        }
        this.i++;
        setTimeout(onInterval.bind(this), 30);
    }.bind(this));
}
