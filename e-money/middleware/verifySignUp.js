const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmailOrPhone = async (req, res, next) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (user) {
            return res.status(400).send({
                message: "Failed! Username is already in use!"
            });
        }

        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            return res.status(400).send({
                message: "Failed! Email is already in use!"
            });
        }

        user = await User.findOne({
            where: {
                email: req.body.phone
            }
        });
        if (user) {
            return res.status(400).send({
                message: "Failed! Phone is already in use!"
            });
        }
        next();
    } catch (error) {
        return res.status(500).send(error);
    }
};

const verifySignUp = {
    checkDuplicateUsernameOrEmailOrPhone,
};
module.exports = verifySignUp;