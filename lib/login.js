const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

module.exports = (user, pass) =>
  new Promise((resolve, reject) => {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 32; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    const params = new URLSearchParams();
    params.append("username", user);
    params.append("password", pass);
    params.append("queryParams", `{"source":"auth_switcher"}`);
    params.append("optIntoOneTap", false);

    fetch("https://www.instagram.com/accounts/login/ajax/", {
      method: "POST",
      body: params,
      headers: {
        "cache-Control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        cookie: `csrftoken=${text};rur=ATN; mid=XLyutwALAAFBrPml4FyOIPgqjDZD`,
        referer:
          "https://www.instagram.com/accounts/login/?source=auth_switcher",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
        "x-csrftoken": text
      }
    })
      .then(res => res.json())
      .then(text => resolve(text))
      .catch(err => reject(err));
  });
