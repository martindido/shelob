'use strict';

var Key = require('./key');
var Metric = require('./metric');

module.exports = function Models(database) {
    this.Key = new Key(database);
    this.Metric = new Metric(database);
    this.Key.hasMany(this.Metric);
    database.sync();
};
