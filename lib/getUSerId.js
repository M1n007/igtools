const fetch = require('node-fetch');
require('dotenv').config();


const getString = (start, end, all) => {
    const regex = new RegExp(`${start}(.*?)${end}`);
    const str = all
    const result = regex.exec(str);
    return result;
}



const functionGetUserId = (username) => new Promise((resolve, reject) => {

    fetch(`https://www.instagram.com/${username}`,
        {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "cookie": `rur=FRC;`,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
            },
            "method": "GET"
        })
        .then(res => res.text())
        .then(res => {
            const userId = getString('"id":"', '",', res)
            resolve(userId[1])
        })
        .catch(err => {
            reject(err)
        })
});

module.exports = {
    functionGetUserId
}