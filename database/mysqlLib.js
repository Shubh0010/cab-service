/*
  Database connection
*/

const mysql = require('mysql');
const util = require('util');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Y
  database: 'my_jugnoo_database'
});

const runQuery = util.promisify(connection.query).bind(connection);

module.exports = { runQuery }