const fetch = require('node-fetch');
const mysql = require("mysql");
const delay = require('delay');
const login = require("./lib/login");
const Follow = require("./lib/follow");
const getCookie = require('./lib/getCookie');
const moment = require('moment');
const colors = require("./lib/colors");
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


const genSes = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

(async () => {

    const csrf = await genSes(32);
    const mid = await genSes(28);

    const newData = [];


    await connection.query(
        `SELECT * FROM user_not_checkpoint`,
        function (error, results, fields) {
            if (error) return 'error';
            delay(5000)
            results.map(test => {
                newData.push(test);
            })
        }
    );

    await delay(5000);
    for (let index = 0; index < newData.length; index++) {
        const element = newData[index];
        await delay(2000)
        const Cookie = await getCookie.functionGetCookie();
        const csrfToken = Cookie[7].split(';')[0];
        const rurz = Cookie[8].split(';')[0];
        const mid = Cookie[9].split(';')[0];
        const LoginToDO = await login.functionLogin(element.username, element.password, csrfToken, rurz, mid);
        const getCookie = await login.functionGetCookie(element.username, element.password, csrfToken, rurz, mid);
        const rur = getCookie.extensions.join().split(',')[1];
        const ds = getCookie.extensions.join().split(',')[3];
        const sessionId = getCookie.extensions.join().split(',')[5];
        if (LoginToDO.authenticated === true) {
            const post = {
                username: element.username,
                password: element.password,
                account_id: element.account_id
            }
            await delay(1000);
            const follow = await Follow.functionFollow(csrf, mid, ds, rur, sessionId);
            if (follow.status === 'ok') {
                console.log(follow, post.username)
            }


        }

    }


})();
