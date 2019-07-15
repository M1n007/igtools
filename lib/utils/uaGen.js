const UserAgent = require('user-agents');
const userAgent = new UserAgent();

const returnUA = async () => new Promise((resolve, rejected) => {
    resolve(userAgent.toString())
});

module.exports = {
    returnUA
}