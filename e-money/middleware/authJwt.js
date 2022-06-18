const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        req.phoneT = decoded.phone;
        req.roleT = decoded.role;
        next();
    });
};

isAdmin = async (req, res, next) => {
    try {
        const roles = "admin";
        if (roles.localeCompare(req.roleT) == 0) {
            return next();
        }
        return res.status(403).send({
            message: "Require admin role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate user role!"
        });
    }
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;