const fetch = require('node-fetch');
require('dotenv').config();


const updateProfile = (csrf, mid, ds, rur, sessionId, shbid, shbts, username, email, user_agent) => new Promise((resolve, reject) => {

    fetch(`https://www.instagram.com/accounts/edit/`,
        {
            "headers": {
                "accept": "*/*",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": csrf,
                "x-ig-app-id": "936619743392459",
                "x-instagram-ajax": "6cb19191eaa3",
                "x-requested-with": "XMLHttpRequest",
                "cookie": `mid=${mid}; csrftoken=${csrf}; ${shbid ? shbid : null}; ${shbts ? shbts : null}  ${ds}; ${sessionId}; ${rur};`,
                "user-agent": user_agent,
            },
            "referrer": `https://www.instagram.com/accounts/edit/`,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `first_name=${username.replace(/[0-9]/g, '')}&email=${email}&username=${username}&phone_number=&biography=Hello%20my%20name%20is%20${username.replace(/[0-9]/g, '')}&external_url=&chaining_enabled=on`,
            "method": "POST"
        })
        .then(res => res.json())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

module.exports = {
    updateProfile
}