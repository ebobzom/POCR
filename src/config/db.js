import mysql from 'mysql';
const enviromentVariables = require('dotenv').config().parsed;
const connectionString = '';
const databaseConfiguration =  {
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
};
// console.log('database connection', databaseConfiguration)
const db = mysql.createPool( connectionString  || databaseConfiguration );

db.on('connection', () => {
    console.log('database connected successfully');
});

db.on('error', (err) => {
    console.log('database connection error: ', err.message);
});

export default db;