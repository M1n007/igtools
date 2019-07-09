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
    const newData = [];


    await connection.query(
        `SELECT * FROM ray_user`,
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
        // const element = {
        //     username: 'amin4udin',
        //     password: 'berak321kiky'
        // }
        await delay(2000)
        const Cookie = await getCookie.functionGetCookie();
        const csrfToken = Cookie[7].split(';')[0];
        const rurz = Cookie[8].split(';')[0];
        const mid = Cookie[9].split(';')[0];
        const LoginToDO = await login.functionLogin(element.username, element.password, csrfToken, rurz, mid);
        const getCookies = await login.functionGetCookie(element.username, element.password, csrfToken, rurz, mid);
        console.log(getCookies.extensions)
        if (LoginToDO.authenticated === true) {
            if (getCookies.extensions.join().split(',')[9] !== undefined) {
                const shbid = getCookie.extensions.join().split(',')[1];
                const shbts = getCookie.extensions.join().split(',')[3];
                const rur = getCookies.extensions.join().split(',')[5];
                const ds = getCookies.extensions.join().split(',')[7];
                const sessionId = getCookies.extensions.join().split(',')[9];
                const post = {
                    username: element.username,
                    password: element.password
                }
                await delay(1000);
                const follow = await Follow.functionFollow(csrfToken, mid, ds, rur, sessionId, shbid, shbts);
                if (follow.status === 'ok') {
                    console.log(follow, post.username)
                }
            } else {
                const rur = getCookies.extensions.join().split(',')[1];
                const ds = getCookies.extensions.join().split(',')[3];
                const sessionId = getCookies.extensions.join().split(',')[5];
                const post = {
                    username: element.username,
                    password: element.password
                }
                await delay(1000);
                const follow = await Follow.functionFollow(csrfToken, mid, ds, rur, sessionId);
                if (follow.status === 'ok') {
                    console.log(follow, post.username)
                }
            }



        }

    }


})();
