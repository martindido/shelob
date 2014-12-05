'use strict';

var Key = require('./key');
var Metric = require('./metric');

module.exports = function Models(database) {
    this.key = new Key(database);
    this.metric = new Metric(database);
    this.key.hasMany(this.metric);
    database.sync();
};
