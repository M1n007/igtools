const fetch = require('node-fetch');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const { URLSearchParams } = require("url");

const functionLogin = (user, pass, csrf, rur, mid, user_agent) =>
  new Promise((resolve, reject) => {

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
        cookie: `${csrf}; ${rur}; ${mid}`,
        referer:
          "https://www.instagram.com/accounts/login/?source=auth_switcher",
        "user-agent": user_agent,
        "x-csrftoken": csrf.split('=')[1]
      }
    })
      .then(res =>
        res.json()
      )
      .then(text => {
        resolve(text)
      })
      .catch(err => reject(err));
  });

const functionGetCookie = (user, pass, csrf, rur, mid, user_agent) =>
  new Promise((resolve, reject) => {

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
        cookie: `${csrf}; ${rur}; ${mid}`,
        referer:
          "https://www.instagram.com/accounts/login/?source=auth_switcher",
        "user-agent": user_agent,
        "x-csrftoken": csrf.split('=')[1]
      }
    })
      .then(res => resolve(Cookie.parse(res.headers.get('set-cookie'))))
      .catch(err => reject(err));
  });


module.exports = {
  functionLogin,
  functionGetCookie

}
