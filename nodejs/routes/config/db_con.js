var mysql = require('mysql');

var connection = {
    host: 'localhost',
    port:3306,
    query: {
        pool: true
    },
    user: 'root',
    password: '930508',
    database: 'inu_hackathon'
};

module.exports = mysql.createPool(connection);
