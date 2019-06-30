const fetch = require("node-fetch");
const UsernameGenerator = require("username-generator");
const delay = require("delay");
const moment = require("moment");
const colors = require("./lib/colors");
const { URLSearchParams } = require("url");
const login = require("./lib/login");
const mysql = require("mysql");
const readlineSync = require('readline-sync');
const fs = require("async-file");
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

const functionRegister = (username, id) =>
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
        cookie: `csrftoken=${id}; rur=FTW; mid=XLuIOQALAAENHU--CtWQwacYm5rW`,
        referer: "https://www.instagram.com/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
        "x-csrftoken": id
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
    for (let index = 0; index < accountCount; index++) {
      const id = await genSes(32);

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
        const regist = await functionRegister(username, id);

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
            const LoginToDO = await login(username, "berak321amin");
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
