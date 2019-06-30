const fetch = require("node-fetch");
const UsernameGenerator = require("username-generator");
const HttpsProxyAgent = require("https-proxy-agent");
const delay = require("delay");
const moment = require("moment");
const colors = require("./lib/colors.js");
const { URLSearchParams } = require("url");
const mysql = require("mysql");

const functionLogin = id =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("username", `amin4udin`);
    params.append("password", "Berak321kiky");
    params.append("queryParams", `{"source":"auth_switcher"}`);
    params.append("optIntoOneTap", false);

    fetch("https://www.instagram.com/accounts/login/ajax/", {
      method: "POST",
      body: params,
      headers: {
        "cache-Control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        cookie: `csrftoken=${id};rur=ATN; mid=XLyutwALAAFBrPml4FyOIPgqjDZD`,
        referer:
          "https://www.instagram.com/accounts/login/?source=auth_switcher",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
        "x-csrftoken": id
      }
    })
      .then(res => res.text())
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
    const id = await genSes(32);
    const bypass = await functionLogin(id);
    console.log(bypass);
  } catch (e) {
    console.log(e);
  }
})();
