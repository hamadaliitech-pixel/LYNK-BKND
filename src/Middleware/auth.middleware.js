const jwt = require('jsonwebtoken')
async function Authuser(req, res, next) {

    console.log("TOKEN:", req.cookies.token);

    const token = req.cookies.token;
    console.log("TOKEN:", req.cookies.token);
    if (!token) {
        return res.status(403).json({ message: "unauthorized!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT ERROR:", error);
        return res.status(403).json({ message: "Unauthorized!" });
    }
}
module.exports = {Authuser}