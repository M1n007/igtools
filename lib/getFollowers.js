const fetch = require('node-fetch');
require('dotenv').config();


const functionGetFollowers = (csrf, mid, ds, rur, sessionId, username) => new Promise((resolve, reject) => {

    fetch(`https://www.instagram.com/${username}/followers/`,
        {
            "headers": {
                "accept": "*/*",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": csrf,
                "cookie": `${mid}; ${csrf}; ${ds}; ${sessionId}; ${rur};`,
            },
            "body": null,
            "method": "GET"
        })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

module.exports = {
    functionGetFollowers
}