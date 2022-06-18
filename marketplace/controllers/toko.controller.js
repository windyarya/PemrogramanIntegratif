const db = require("../models");
const config = require("../config/auth.config");
const e = require("cors");
const User = db.user;
const Trans = db.trans;
const Toko = db.toko;
const Product = db.product;
const Op = db.Sequelize.Op;

exports.addToko = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (user.isSeller == 1) {
            return res.status(400).send({
                message: "You already have a store. One user can only has one store!"
            })
        }

        Toko.create({
            name: req.body.name,
            id_owner: req.userId,
            address: req.body.address,
            status: 0,
            description: req.body.description
        }).then(toko => {
            User.update({ isSeller: 1}, {
                where: {
                    id: req.userId
                } 
            }).then(user => {
                res.status(200).send({
                    message: "Toko registered successfully!"
                })
            }).catch(err => {
                return res.status(500).send({
                    message: err.message
                })
            })
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
};

exports.editToko = (req, res) => {
    Toko.findOne({
        where: {
            id_owner: req.userId
        }
    }).then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Toko not found! You don't have any store/toko."
            })
        }
        if (req.body.address) {
            Toko.update({address: req.body.address}, {
                where: {
                    id: user.id
                }
            }).then(user1 => {
                return res.status(200).send({
                    message: "Update address successfully!"
                })
            }).catch(err => {
                return res.status(500).send({
                    message: err.message
                })
            })
        } else if (req.body.status) {
            Toko.update({status: req.body.status}, {
                where: {
                    id: user.id
                }
            }).then(user1 => {
                return res.status(200).send({
                    message: "Update status successfully!"
                })
            }).catch(err => {
                return res.status(500).send({
                    message: err.message
                })
            })
        }
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
};

exports.getToko = (req, res) => {
    if(req.body.name) {
        Toko.findAll({
            where: {
                name: {
                    [Op.substring]: req.body.name
                }
            }
        }).then(toko => {
            if(!toko) {
                return res.status(404).send({
                    message: "Toko not found!"
                })
            }
    
            return res.status(200).send(toko)
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else {
        Toko.findAll()
        .then(toko => {
            return res.status(200).send(toko)
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    }
};