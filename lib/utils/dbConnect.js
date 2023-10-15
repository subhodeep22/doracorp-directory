const pgp = require('pg-promise')();
const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 30, // use up to 30 connections
    idleTimeoutMillis: 1000,
    allowExitOnIdle: true
};
module.exports = pgp(connection);