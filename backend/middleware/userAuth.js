const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Authentication = async (req, res, next) => {
    try {
        // Get Token from Cookie
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "No Authentication Token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
            return res.send(403).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({ error: e.message, message: "Not Authenticated" });
    }
}

module.exports = Authentication;