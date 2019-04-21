const fetch = require("node-fetch");
const UsernameGenerator = require("username-generator");
const HttpsProxyAgent = require("https-proxy-agent");
const delay = require("delay");
const moment = require("moment");
const colors = require("./lib/colors.ts");
const { URLSearchParams } = require("url");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ig"
});

const functionRegister = (username, id) =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("email", `${username}@gmail.com`);
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
    for (let index = 0; index < 100; index++) {
      const id = await genSes(32);
      const username = UsernameGenerator.generateUsername();
      await delay(120000);
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
          "Sukses Register",
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
          function(error, results, fields) {
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
          "Sukses!",
          query.values,
          colors.Reset
        );
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
    }
  } catch (e) {
    console.log(e);
  }
})();
