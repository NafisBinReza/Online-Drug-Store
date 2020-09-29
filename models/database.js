const mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mdm'
});

module.exports = connection;