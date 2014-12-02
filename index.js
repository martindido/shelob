'use strict';

var config = require('./config');

var Server = require('./lib/server');
var server = new Server(config.server);

var Client = require('./lib/client');
var client = new Client(config.client);

setInterval(onInterval, config.interval);

function onInterval() {
    client.send(server.metrics);
}
