'use strict';

var config = require('./config');


var Server = require('./lib/server');
var server = new Server(config.server);

var Udp = require('./lib/clients/udp');
var Sql = require('./lib/clients/sql');

server.addClient(new Udp(config.clients.udp));
server.addClient(new Sql(config.clients.sql));
server.start();
