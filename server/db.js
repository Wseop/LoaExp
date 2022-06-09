const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let db = {};

MongoClient.connect(process.env.URI_CONNECTION, (err, client) => {
    if (err) throw err;

    db.client = client.db(process.env.DB_NAME);
});

module.exports = db;