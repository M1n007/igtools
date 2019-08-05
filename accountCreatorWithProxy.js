const fetch = require('node-fetch');
const UsernameGenerator = require("username-generator");
const delay = require("delay");
const moment = require("moment");
const colors = require("./lib/colors");
const { URLSearchParams } = require("url");
const login = require("./lib/login");
const getCookie = require('./lib/getCookie');
const updateProfile = require('./lib/profileEdit');
const mysql = require("mysql");
const readlineSync = require('readline-sync');
const fs = require("async-file");
const UA = require('./lib/utils/uaGen');
const fss = require("fs");
const ProxyCheck = require('./lib/proxyCheck');
const tunnel = require('tunnel');
require('dotenv').config()

console.log("");
console.log("");
const fileName = readlineSync.question('proxy file (ex. proxy.txt) : ');
const delaYY = readlineSync.question('input delay (600000) : ');
const choiseDb = readlineSync.question('choose db (Y) for mysql, (N) for txt : ');

if (choiseDb.toLowerCase() === 'y' && process.env.DB_HOST === 'default') {
    console.log("");
    console.log("");
    console.log(colors.FgRed, 'Please edit your configuration at .env file.', colors.Reset);
    console.log("");
    console.log("");
    process.exit();
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const functionRegister = async (username, csrf, rur, mid, user_agent, prox) =>
    new Promise(function (resolve, reject) {
        var tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: prox.split(':')[0],
                port: prox.split(':')[1],
            }
        });

        const params = new URLSearchParams();
        params.append("email", `${username}@aminudin.me`);
        params.append("password", "berak321amin");
        params.append("username", username);
        params.append("first_name", `${username.split('1')[0]} ${username.split('1')[1]}`);
        // params.append("client_id", mid);
        params.append("seamless_login_enabled", 1);
        // params.append("gdpr_s", [0, 2, 0, null]);
        params.append("tos_version", "eu");
        params.append("opt_into_one_tap", false);

        fetch("https://www.instagram.com/accounts/web_create_ajax/", {
            method: "POST",
            body: params,
            headers: {
                'origin': 'https://www.instagram.com',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'user-agent': user_agent,
                'x-requested-with': 'XMLHttpRequest',
                'cookie': `ig_cb=1; ${rur}; ${csrf}; ${mid}`,
                'x-csrftoken': csrf.split('=')[1],
                'x-ig-app-id': 936619743392459,
                'x-instagram-ajax': '1ead163a5727',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*',
                'referer': 'https://www.instagram.com/',
                'authority': 'www.instagram.com',
                'sec-fetch-site': 'same-origin'
            },
            agent: tunnelingAgent
        })
            .then(response => response.json())
            .then(text =>
                resolve(text)
            )
            .catch(err => reject(err));

    });

(async function main() {

    await console.log("");
    await console.log("");
    await fss.readFile(fileName, async function (err, data) {
        if (err) throw err;
        const array = data
            .toString()
            .replace(/\r\n|\r|\n/g, " ")
            .split(" ");

        for (let proxy in array) {
            const prox = await array[proxy];
            await console.log(
                "[" +
                " " +
                moment().format("HH:mm:ss") +
                " " +
                "]" +
                " " +
                "=>" +
                " " +
                colors.FgGreen,
                "Checking proxy...." + " " + prox,
                colors.Reset
            );

            const group = await ProxyCheck.getGroups(prox);
            await delay(5000);
            while (true) {
                const getResults = await ProxyCheck.getResult(group);
                if (getResults.working === 1) {
                    await console.log(
                        "[" +
                        " " +
                        moment().format("HH:mm:ss") +
                        " " +
                        "]" +
                        " " +
                        "=>" +
                        " " +
                        colors.FgGreen,
                        "Proxy working perfectly :" + " " + prox,
                        colors.Reset
                    );

                    const user_agent = await UA.returnUA();

                    const username = UsernameGenerator.generateUsername("1");
                    const name = `${username.split('1')[0]} ${username.split('1')[1]}`;
                    await console.log(
                        "[" +
                        " " +
                        moment().format("HH:mm:ss") +
                        " " +
                        "]" +
                        " " +
                        "=>" +
                        " " +
                        colors.FgGreen,
                        "generate username :" + " " + username,
                        colors.Reset
                    );
                    await console.log(
                        "[" +
                        " " +
                        moment().format("HH:mm:ss") +
                        " " +
                        "]" +
                        " " +
                        "=>" +
                        " " +
                        colors.FgGreen,
                        "Name :" + " " + name,
                        colors.Reset
                    );
                    if (username.includes("-") !== true) {
                        await console.log(
                            "[" +
                            " " +
                            moment().format("HH:mm:ss") +
                            " " +
                            "]" +
                            " " +
                            "=>" +
                            " " +
                            colors.FgGreen,
                            "Try to register",
                            colors.Reset
                        );
                        const Cookie = await getCookie.functionGetCookie(user_agent);
                        const csrfToken = Cookie[7].split(';')[0];
                        const rur = Cookie[8].split(';')[0];
                        const mid = Cookie[9].split(';')[0];
                        await delay(delaYY);  //normally and safe 600000
                        try {
                            const regist = await functionRegister(username, csrfToken, rur, mid, user_agent, prox);
                            // console.log(regist)
                            // if (!regist) {
                            //     await console.log(
                            //         "[" +
                            //         " " +
                            //         moment().format("HH:mm:ss") +
                            //         " " +
                            //         "]" +
                            //         " " +
                            //         "=>" +
                            //         " " +
                            //         colors.FgRed,
                            //         `Theres have any problem. Check your proxy and try again`,
                            //         colors.Reset
                            //     );
                            // }

                            if (regist && regist.account_created === true) {
                                await console.log(
                                    "[" +
                                    " " +
                                    moment().format("HH:mm:ss") +
                                    " " +
                                    "]" +
                                    " " +
                                    "=>" +
                                    " " +
                                    colors.FgGreen,
                                    `Email server : generator.email/aminudin.me/${username}`,
                                    colors.Reset
                                );
                                await console.log(
                                    "[" +
                                    " " +
                                    moment().format("HH:mm:ss") +
                                    " " +
                                    "]" +
                                    " " +
                                    "=>" +
                                    " " +
                                    colors.FgGreen,
                                    "Success Register",
                                    colors.Reset
                                );
                                await console.log(
                                    "[" +
                                    " " +
                                    moment().format("HH:mm:ss") +
                                    " " +
                                    "]" +
                                    " " +
                                    "=>" +
                                    " " +
                                    colors.FgGreen,
                                    "Message : ",
                                    regist,
                                    colors.Reset
                                );
                                if (regist && regist.account_created) {
                                    await console.log(
                                        "[" +
                                        " " +
                                        moment().format("HH:mm:ss") +
                                        " " +
                                        "]" +
                                        " " +
                                        "=>" +
                                        " " +
                                        colors.FgGreen,
                                        `Try to login with account : ${username}`,
                                        colors.Reset
                                    );
                                    await delay(10000);
                                    const LoginToDO = await login.functionLogin(username, "berak321amin", csrfToken, rur, mid, user_agent);
                                    const getCookies = await login.functionGetCookie(username, "berak321amin", csrfToken, rur, mid, user_agent);

                                    if (LoginToDO.authenticated === true) {
                                        await console.log(
                                            "[" +
                                            " " +
                                            moment().format("HH:mm:ss") +
                                            " " +
                                            "]" +
                                            " " +
                                            "=>" +
                                            " " +
                                            colors.FgGreen,
                                            `Login success!`,
                                            colors.Reset
                                        );
                                        if (choiseDb.toLowerCase() === 'y') {
                                            const post = {
                                                username: username,
                                                password: "berak321amin",
                                                account_id: regist.user_id
                                            };
                                            await console.log(
                                                "[" +
                                                " " +
                                                moment().format("HH:mm:ss") +
                                                " " +
                                                "]" +
                                                " " +
                                                "=>" +
                                                " " +
                                                colors.FgGreen,
                                                "insert to database",
                                                colors.Reset
                                            );
                                            delay(5000);
                                            const query = await connection.query(
                                                "INSERT INTO user SET ?",
                                                post,
                                                function (error, results, fields) {
                                                    if (error) throw error;
                                                    // Neat!
                                                }
                                            );
                                            await console.log(
                                                "[" +
                                                " " +
                                                moment().format("HH:mm:ss") +
                                                " " +
                                                "]" +
                                                " " +
                                                "=>" +
                                                " " +
                                                colors.FgGreen,
                                                "Success!",
                                                query.values,
                                                colors.Reset
                                            );
                                        } else {
                                            await console.log(
                                                "[" +
                                                " " +
                                                moment().format("HH:mm:ss") +
                                                " " +
                                                "]" +
                                                " " +
                                                "=>" +
                                                " " +
                                                colors.FgGreen,
                                                "Format account : username|password|account_id",
                                                colors.Reset
                                            );
                                            await console.log(
                                                "[" +
                                                " " +
                                                moment().format("HH:mm:ss") +
                                                " " +
                                                "]" +
                                                " " +
                                                "=>" +
                                                " " +
                                                colors.FgGreen,
                                                "Create file : result_account.txt",
                                                colors.Reset
                                            );
                                            const post = {
                                                username: username,
                                                password: "berak321amin",
                                                account_id: regist.user_id
                                            };
                                            await fs.appendFile(
                                                "result_account.txt",
                                                `${post.username}|${post.password}|${post.account_id}\n`,
                                                "utf-8"
                                            );
                                            await console.log(
                                                "[" +
                                                " " +
                                                moment().format("HH:mm:ss") +
                                                " " +
                                                "]" +
                                                " " +
                                                "=>" +
                                                " " +
                                                colors.FgGreen,
                                                "Success!",
                                                colors.Reset
                                            );
                                        }

                                    }
                                }


                                await console.log("");
                                await console.log("");
                            } else {
                                await console.log(
                                    "[" +
                                    " " +
                                    moment().format("HH:mm:ss") +
                                    " " +
                                    "]" +
                                    " " +
                                    "=>" +
                                    " " +
                                    colors.FgRed,
                                    "Failed Register",
                                    colors.Reset
                                );
                                await console.log(
                                    "[" +
                                    " " +
                                    moment().format("HH:mm:ss") +
                                    " " +
                                    "]" +
                                    " " +
                                    "=>" +
                                    " " +
                                    colors.FgGreen,
                                    "Message : ",
                                    regist,
                                    colors.Reset
                                );
                                await console.log("");
                                await console.log("");
                            }
                        } catch (e) {
                            await console.log(
                                "[" +
                                " " +
                                moment().format("HH:mm:ss") +
                                " " +
                                "]" +
                                " " +
                                "=>" +
                                " " +
                                colors.FgRed,
                                "Message : theres have any problem, try again.", e,
                                colors.Reset
                            );
                            await console.log("");
                            await console.log("");
                        }
                    } else {
                        await console.log(
                            "[" +
                            " " +
                            moment().format("HH:mm:ss") +
                            " " +
                            "]" +
                            " " +
                            "=>" +
                            " " +
                            colors.FgRed,
                            "Failed",
                            colors.Reset
                        );
                        await console.log(
                            "[" +
                            " " +
                            moment().format("HH:mm:ss") +
                            " " +
                            "]" +
                            " " +
                            "=>" +
                            " " +
                            colors.FgRed,
                            "Message : username include character not allowed for register",
                            colors.Reset
                        );
                        await console.log("");
                        await console.log("");
                    }
                    break;
                } else {
                    await console.log(
                        "[" +
                        " " +
                        moment().format("HH:mm:ss") +
                        " " +
                        "]" +
                        " " +
                        "=>" +
                        " " +
                        colors.FgRed,
                        "Proxy not working :" + " " + prox,
                        colors.Reset
                    );
                    await console.log("");
                    await console.log("");
                    break;
                }
            }

        }
    });

})();
