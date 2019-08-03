const fetch = require('node-fetch');
require('dotenv').config();


const functionFollow = (csrf, mid, ds, rur, sessionId, shbid, shbts, username, userId, user_agent) => new Promise((resolve, reject) => {
    fetch(`https://www.instagram.com/web/friendships/${userId}/follow/`,
        {
            "method": "POST",
            "headers": {
                'sec-fetch-mode': 'cors',
                'origin': 'https://www.instagram.com',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'cookie': `ig_cb=1; ${mid}; ${csrf}; ${shbid ? shbid : null}; ${shbts ? shbts : null} ${ds}; ${sessionId}; ${rur};`,
                'x-csrftoken': csrf.split('=')[1],
                'x-ig-app-id': '936619743392459',
                'x-instagram-ajax': '1ead163a5727',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*',
                'referer': 'https://www.instagram.com/amin4udin/',
                'authority': 'www.instagram.com',
                'sec-fetch-site': 'same-origin',
                'content-length': '0'
            }
        })
        .then(res => res.text())
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