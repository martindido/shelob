'use strict';

var Sequelize = require('sequelize');

module.exports = function Key(database) {
    return database.define('Key', {
        name: Sequelize.STRING
    });
};
