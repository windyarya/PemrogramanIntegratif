const db = require("../models");
const config = require("../config/auth.config");
const e = require("cors");
const User = db.user;
const Trans = db.trans;
const Toko = db.toko;
const Product = db.product;
const Op = db.Sequelize.Op;
var axios = require("axios");
var qs = require("querystring");
const { response } = require("express");

exports.editUser = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        User.update({
            address: address,
        }, {
            where: {
                id: req.id
            }
        }).then(user1 => {
            return res.status(200).send({
                message: "Update user address successfully!"
            })
        })
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
};

exports.deleteUser = (req, res) => {
    if (req.isAdminT == 1) {
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found!"
                })
            }
            User.destroy({
                where: {
                    email: req.body.email
                }
            }).then(user1 => {
                return res.status(200).send({
                    message: "Delete user successfully!"
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
    }
};

exports.getUser = (req, res) => {
    if (req.isAdminT == 1) {
        User.findAll()
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "No User found!"
                })
            }

            return res.status(200).send(user)
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else {
        User.findOne({
            where: {
                id: req.userId
            }
        }).then(user => {
            return res.status(200).send(user)
        }).catch(err => {
            message: err.message
        })
    }
};