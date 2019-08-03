const fetch = require('node-fetch');
const delay = require('delay');
const HttpProxyAgent = require('http-proxy-agent');
const { URLSearchParams } = require("url");

const getGroups = () => new Promise((resolve, reject) => {
    const url = 'https://hidemyna.me/api/checker.php?out=js&action=list_new&tasks=http,ssl,socks4,socks5&parser=lines'
    const params = new URLSearchParams();
    params.append('data', '136.244.70.195:30325');

    const uri = 'https://136.244.70.195:30325';

    fetch(url, {
        method: 'POST',
        headers: {
            'origin': 'https://hidemyna.me',
            'referer': ' https://hidemyna.me/en/proxy-checker/',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
        },
        agent: new HttpProxyAgent(uri),
        body: params
    })
        .then(res => res.text())
        .then(res => {
            console.log(res)
            resolve(res.group);
        })
        .catch(err => {
            reject(err);
        })
});

const getResult = (group) => new Promise((resolve, reject) => {
    const url = `https://hidemyna.me/api/checker.php?out=js&action=get&filters=progress!:queued;changed:1&fields=resolved_ip,progress,progress_http,progress_ssl,progress_socks4,progress_socks5,time_http,time_ssl,time_socks4,time_socks5,result_http,result_ssl,result_socks4,result_socks5&groups=${group}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'origin': 'https://hidemyna.me',
            'referer': ' https://hidemyna.me/en/proxy-checker/',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
        }
    })
        .then(res => res.json())
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err)
        })
});


(async () => {
    const group = await getGroups();
    for (let index = 0; index < 15; index++) {
        await delay(1000);
        const getResults = await getResult(group);
        if (getResults.finished === 1 && getResults.items) {
            console.log(getResults)
        }
    }

})();