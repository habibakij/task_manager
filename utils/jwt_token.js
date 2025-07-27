const jwtToken = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

var tokenGenerate = (payload) => {
    return jwtToken.sign(payload, secretKey, { expiresIn: '5m' });
};

var tokenVerification = (token) => {
    try {
        return jwtToken.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { tokenGenerate, tokenVerification };