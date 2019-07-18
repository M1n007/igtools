const fetch = require('node-fetch');
const { URLSearchParams } = require("url");

const functionRegister = (username, csrf, rur, mid, user_agent) =>
    new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("email", `${username}@aminudin.me`);
        params.append("password", "berak321amin");
        params.append("username", username);
        params.append("first_name", username);
        params.append("opt_into_one_tap", false);

        fetch("https://www.instagram.com/accounts/web_create_ajax/attempt/", {
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

module.exports = {
    functionRegister
}