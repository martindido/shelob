'use strict';

var Sequelize = require('sequelize');

module.exports = function Metric(database) {
    return database.define('Metric', {
        value: Sequelize.FLOAT,
        timestamp: Sequelize.DATE
    });
};
