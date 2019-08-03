const UserAgent = require('user-agents');
const userAgent = new UserAgent({ deviceCategory: 'desktop' });

const returnUA = async () => new Promise((resolve, rejected) => {
    resolve('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36')
});

module.exports = {
    returnUA
}