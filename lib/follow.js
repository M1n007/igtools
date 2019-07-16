const fetch = require('node-fetch');
require('dotenv').config();


const functionFollow = (csrf, mid, ds, rur, sessionId, shbid, shbts, username, userId, user_agent) => new Promise((resolve, reject) => {
    fetch(`https://www.instagram.com/web/friendships/${userId}/follow/`,
        {
            "headers": {
                // "accept": "*/*",
                // "accept-language":
                //     "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": csrf,
                "x-ig-app-id": "936619743392459",
                "x-instagram-ajax": "6cb19191eaa3",
                "x-requested-with": "XMLHttpRequest",
                "cookie": `mid=${mid}; csrftoken=${csrf}; ${shbid ? shbid : null}; ${shbts ? shbts : null}  ${ds}; ${sessionId}; ${rur};`,
                "user-agent": `${user_agent}`,
            },
            "referrer": `https://www.instagram.com/${username}/`,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "POST"
        })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

module.exports = {
    functionFollow
}