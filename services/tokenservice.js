const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = function (admin) {
    const token = jwt.sign(admin, process.env.PRIVATE_KEY);
    return token;
}

module.exports = {
    generateAccessToken
}