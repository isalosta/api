'use strict'

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'causedb.c97wkw9lrlvt.ap-southeast-1.rds.amazonaws.com',
    port: '3306',
    user: 'cause_admin',
    password: 'KillYourLazy',
    database: 'innodb'
});

function Get_SQL_Array(query, callback) {
    connection.connect();
    connection.query(query, function(error, result, fields){
        if (error) {
            throw error;
        }
        callback(result);
    });

    connection.end();
}

module.exports = {
    Get_SQL_Array
}