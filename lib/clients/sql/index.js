'use strict';

var Sequelize = require('sequelize');
var async = require('async');
var Models = require('./models');

module.exports = Sql;

function Sql(options) {
    options = options || {};
    this.name = options.name;
    this.username = options.username;
    this.password = options.password;
    this.options = options.options || {};
    this.start();
}

Sql.prototype.start = function start() {
    this.database = new Sequelize(this.name, this.username, this.password, this.options);
    this.models = new Models(this.database);
}

Sql.prototype.send = function send(metrics) {
    /* TODO */
};
