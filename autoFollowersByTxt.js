const fetch = require('node-fetch');
const mysql = require("mysql");
const delay = require('delay');
const login = require("./lib/login");
const Follow = require("./lib/follow");
const getCookie = require('./lib/getCookie');
const getUserId = require('./lib/getUSerId');
const moment = require('moment');
const colors = require("./lib/colors");
const UA = require('./lib/utils/uaGen');
const readlineSync = require('readline-sync');
const fs = require("fs");
require('dotenv').config();

console.log("");
console.log("");
const username = readlineSync.question('Masukan username target : ');
const fileName = readlineSync.question('Masukan nama file : ');
const delimiter = readlineSync.question('Masukan delimiter ex. | : ');
const delayy = readlineSync.question('Masukan delay : ');
console.log("");
console.log("");

(async () => {
    const userId = await getUserId.functionGetUserId(username);
    const user_agent = await UA.returnUA();
    await console.log(
        "[" +
        " " +
        moment().format("HH:mm:ss") +
        " " +
        "]" +
        " " +
        "=>" +
        " " +
        colors.FgGreen,
        "User ID target :" + " " + userId,
        colors.Reset
    );

    await fs.readFile(fileName, async function (err, data) {
        if (err) throw err;
        const array = data
            .toString()
            .replace(/\r\n|\r|\n/g, " ")
            .split(" ");

        for (let igAccount in array) {
            const element = {
                username: array[igAccount].split(delimiter)[0],
                password: array[igAccount].split(delimiter)[1]
            }
            await delay(delayy)
            const Cookie = await getCookie.functionGetCookie(user_agent);
            const csrfToken = Cookie[7].split(';')[0];
            const rurz = Cookie[8].split(';')[0];
            const mid = Cookie[9].split(';')[0];
            const LoginToDO = await login.functionLogin(element.username, element.password, csrfToken, rurz, mid, user_agent);
            const getCookies = await login.functionGetCookie(element.username, element.password, csrfToken, rurz, mid, user_agent);
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
                    const follow = await Follow.functionFollow(csrfToken, mid, ds, rur, sessionId, shbid, shbts, username, userId, user_agent);
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
                    };

                    const shbidddd = '';
                    const shbtsss = '';

                    await delay(1000);
                    const follow = await Follow.functionFollow(csrfToken, mid, ds, rur, sessionId, shbidddd, shbtsss, username, userId, user_agent);
                    if (follow.status === 'ok') {
                        console.log(follow, post.username)
                    }
                }
            }
        }
    })


})();
