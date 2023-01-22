const mysql = require('mysql');

const pool = mysql.createConnection({
    // port: '3306',
    // host: 'sql6.freemysqlhosting.net',
    // user: 'sql6589483',
    // password: 'SAse7CxFWv',
    // database: 'sql6589483',
    // connectionLimit: 10  
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_Db,
    connectionLimit: 10 
})
module.exports = pool