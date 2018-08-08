var mysql = require('mysql');

var connection = {
    host: 'localhost',
    port:3306,
    query: {
        pool: true
    },
    user: 'root',
    password: 'root',
    database: 'exnode'
};

module.exports = mysql.createPool(connection);
