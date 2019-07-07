const fetch = require('node-fetch');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;


const functionGetCookie = () =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        fetch("https://www.instagram.com/", {
            method: "GET",
            headers: {
                // cookie: `csrftoken=${text}; rur=FRC; mid=XSGF3AALAAEqBPXXdL8CThfwPkkj`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
                // "x-csrftoken": text
            }
        })
            .then(res => resolve(res.headers.raw()['set-cookie']))
            .catch(err => reject(err));
    });


module.exports = {
    functionGetCookie
}
