const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saanvi@0312',
    database: 'automotive_store'
});

db.connect((err) => {

    if (err) {

        console.log(err);

    } else {

        console.log('Database Connected Successfully');

    }

});

module.exports = db;