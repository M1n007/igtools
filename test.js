const fs = require("fs");
const mysql = require("mysql");
const delay = require('delay');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

(async () => {

    await fs.readFile('ig.txt', async function (err, data) {
        if (err) throw err;
        const array = data
            .toString()
            .replace(/\r\n|\r|\n/g, " ")
            .split(" ");

        for (let ury in array) {

            // await delay(1000);
            // const query = await connection.query(
            //     `SELECT * FROM user WHERE username = ${array[ury].split('|')[0]}`,
            //     function (error, results, fields) {
            //         if (error) return 'error';
            //         // Neat!
            //     }
            // );

            // if (query === 'error') {
            const post = {
                username: array[ury].split('|')[0],
                password: "berak321amin",
                account_id: array[ury].split('|')[2]
            };
            const query = await connection.query(
                "INSERT INTO user SET ?",
                post,
                function (error, results, fields) {
                    if (error) throw error;
                    // Neat!
                }
            );
            console.log(query.values)
            // }
        }

    });
})();
