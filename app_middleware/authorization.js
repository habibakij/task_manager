
const {tokenGenerate, tokenVerification, } = require("../utils/jwt_token");

var tokenAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Access denied, No token found' });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied, No token provided' });
    }

    try {
        const decoded = tokenVerification(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ error: 'Invalid token '+error.message });
    }
}

module.exports = tokenAuthentication;