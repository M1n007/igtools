const fetch = require('node-fetch');
const UsernameGenerator = require("username-generator");
const delay = require("delay");
const moment = require("moment");
const colors = require("./lib/colors");
const { URLSearchParams } = require("url");
const login = require("./lib/login");
const getCookie = require('./lib/getCookie');
const updateProfile = require('./lib/profileEdit');
const mysql = require("mysql");
const readlineSync = require('readline-sync');
const fs = require("async-file");
const UA = require('./lib/utils/uaGen');
require('dotenv').config()

console.log("");
console.log("");
const accountCount = readlineSync.question('number of account : ')
const delaYY = readlineSync.question('input delay (600000) : ')
const choiseDb = readlineSync.question('choose db (Y) for mysql, (N) for txt : ')

if (choiseDb.toLowerCase() === 'y' && process.env.DB_HOST === 'default') {
  console.log("");
  console.log("");
  console.log(colors.FgRed, 'Please edit your configuration at .env file.', colors.Reset);
  console.log("");
  console.log("");
  process.exit();
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const functionRegister = (username, csrf, rur, mid, user_agent) =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("email", `${username}@aminudin.me`);
    params.append("password", "berak321amin");
    params.append("username", username);
    params.append("first_name", username);
    params.append("seamless_login_enabled", 1);
    params.append("tos_version", "eu");
    params.append("opt_into_one_tap", false);

    fetch("https://www.instagram.com/accounts/web_create_ajax/", {
      method: "POST",
      body: params,
      headers: {
        "cache-Control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        cookie: `${csrf}; ${rur}; ${mid}`,
        referer: "https://www.instagram.com/",
        "user-agent": user_agent,
        "x-csrftoken": csrf.split('=')[1]
      }
    })
      .then(res => res.json())
      .then(text => resolve(text))
      .catch(err => reject(err));
  });

const genSes = length =>
  new Promise((resolve, reject) => {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    resolve(text);
  });

(async function main() {
  try {
    await console.log("");
    await console.log("");
    const user_agent = await UA.returnUA();
    for (let index = 0; index < accountCount; index++) {

      const username = UsernameGenerator.generateUsername();
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
        "generate username :" + " " + username,
        colors.Reset
      );
      if (username.includes("-") !== true) {
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
          "Try to register",
          colors.Reset
        );
        await delay(delaYY);  //normally and safe 600000
        const Cookie = await getCookie.functionGetCookie(user_agent);
        const csrfToken = Cookie[7].split(';')[0];
        const rur = Cookie[8].split(';')[0];
        const mid = Cookie[9].split(';')[0];
        const regist = await functionRegister(username, csrfToken, rur, mid, user_agent);

        if (regist.account_created === true) {
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
            `Email server : generator.email/aminudin.me/${username}`,
            colors.Reset
          );
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
            "Success Register",
            colors.Reset
          );
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
            "Message : ",
            regist,
            colors.Reset
          );
          if (regist.account_created) {
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
              `Try to login with account : ${username}`,
              colors.Reset
            );
            await delay(10000);
            const LoginToDO = await login.functionLogin(username, "berak321amin", csrfToken, rur, mid, user_agent);
            const getCookies = await login.functionGetCookie(username, "berak321amin", csrfToken, rur, mid, user_agent);

            if (LoginToDO.authenticated === true) {
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
                `Login success!`,
                colors.Reset
              );
              if (choiseDb.toLowerCase() === 'y') {
                const post = {
                  username: username,
                  password: "berak321amin",
                  account_id: regist.user_id
                };
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
                  "insert to database",
                  colors.Reset
                );
                delay(5000);
                const query = await connection.query(
                  "INSERT INTO user SET ?",
                  post,
                  function (error, results, fields) {
                    if (error) throw error;
                    // Neat!
                  }
                );
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
                  "Success!",
                  query.values,
                  colors.Reset
                );
              } else {
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
                  "Format account : username|password|account_id",
                  colors.Reset
                );
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
                  "Create file : result_account.txt",
                  colors.Reset
                );
                const post = {
                  username: username,
                  password: "berak321amin",
                  account_id: regist.user_id
                };
                await fs.appendFile(
                  "result_account.txt",
                  `${post.username}|${post.password}|${post.account_id}\n`,
                  "utf-8"
                );
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
                  "Success!",
                  colors.Reset
                );
              }


              if (getCookies.extensions.join().split(',')[9] !== undefined) {
                const shbid = getCookie.extensions.join().split(',')[1];
                const shbts = getCookie.extensions.join().split(',')[3];
                const rur = getCookies.extensions.join().split(',')[5];
                const ds = getCookies.extensions.join().split(',')[7];
                const sessionId = getCookies.extensions.join().split(',')[9];
                const post = {
                  username: username,
                  password: "berak321amin"
                }
                await delay(1000);
                const updateProf = await updateProfile.updateProfile(csrfToken, mid, ds, rur, sessionId, shbidddd, shbtsss, username, `${username}@aminudin.me`, user_agent);
                // if (follow.status === 'ok') {
                //   console.log(follow, post.username)
                // }
                console.log(updateProf);
              } else {
                const rur = getCookies.extensions.join().split(',')[1];
                const ds = getCookies.extensions.join().split(',')[3];
                const sessionId = getCookies.extensions.join().split(',')[5];
                const post = {
                  username: username,
                  password: "berak321amin"
                }

                const shbidddd = '';
                const shbtsss = '';
                await delay(1000);
                const updateProf = await updateProfile.updateProfile(csrfToken, mid, ds, rur, sessionId, shbidddd, shbtsss, username, `${username}@aminudin.me`, user_agent);
                // if (follow.status === 'ok') {
                //   console.log(follow, post.username)
                // }
                console.log(updateProf);
              }

            }
          }


          await console.log("");
          await console.log("");
        } else {
          await console.log(
            "[" +
            " " +
            moment().format("HH:mm:ss") +
            " " +
            "]" +
            " " +
            "=>" +
            " " +
            colors.FgRed,
            "Failed Register",
            colors.Reset
          );
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
            "Message : ",
            regist,
            colors.Reset
          );
          await console.log("");
          await console.log("");
        }
      } else {
        await console.log(
          "[" +
          " " +
          moment().format("HH:mm:ss") +
          " " +
          "]" +
          " " +
          "=>" +
          " " +
          colors.FgRed,
          "Failed",
          colors.Reset
        );
        await console.log(
          "[" +
          " " +
          moment().format("HH:mm:ss") +
          " " +
          "]" +
          " " +
          "=>" +
          " " +
          colors.FgRed,
          "Message : username include character not allowed for register",
          colors.Reset
        );
        await console.log("");
        await console.log("");
      }
    }
  } catch (e) {
    console.log(e);
  }
})();
