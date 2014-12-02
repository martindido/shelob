'use strict';

module.exports = {
    server: {
        host: '127.0.0.1',
        port: 9002,
        interval: 10000
    },
    clients: {
        udp: {
            host: '127.0.0.1',
            port: 9003,
        },
        sql: {
            name: 'shelob',
            username: 'root',
            password: '123456789',
            options: {}
        }
    }
};
