import mysql from 'mysql';
const enviromentVariables = require('dotenv').config().parsed;
const connectionString = '';
const databaseConfiguration =  {
    host : enviromentVariables.HOST,
    user : enviromentVariables.USER,
    password : enviromentVariables.PASSWORD,
    database : enviromentVariables.DATABASE
};
console.log('database connection', databaseConfiguration)
const db = mysql.createPool( connectionString  || databaseConfiguration );

db.on('connection', () => {
    console.log('database connected successfully');
});

db.on('error', (err) => {
    console.log('database connection error: ', err.message);
});

export default db;