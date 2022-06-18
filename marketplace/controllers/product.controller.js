const db = require("../models");
const config = require("../config/auth.config");
const e = require("cors");
const { toko, product } = require("../models");
const User = db.user;
const Trans = db.trans;
const Toko = db.toko;
const Product = db.product;
const Op = db.Sequelize.Op;

exports.addProduct = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (user.isSeller == 0) {
            return res.status(400).send({
                message: "You aren't the seller!"
            })
        }

        Toko.findOne({
            where: {
                id_owner: req.userId
            }
        }).then(toko => {
            if (!toko) {
                return res.status(404).send({
                    message: "Toko not found! You probably not the seller."
                })
            }

            Product.create({
                id_toko: toko.id,
                name: req.body.name,
                price: req.body.price,
                max_weight: req.body.max_weight,
                description: req.body.description
            }).then(product => {
                Toko.update({ status: 1 }, {
                    where: {
                        id: toko.id
                    }
                }).then(toko1 => {
                    return res.status(200).send({
                        message: "Product added successfully!"
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
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
};

exports.editProduct = (req, res) => {
    Toko.findOne({
        where: {
            id_owner: req.userId
        }
    }).then(toko => {
        if (!toko) {
            return res.status(404).send({
                message: "Toko not found! You don't have any store/toko."
            })
        }
        Product.findOne({
            where: {
                id_toko: toko.id,
                name: {
                    [Op.substring]: req.body.name
                }
            }
        }).then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found"
                })
            }

            Product.update({
                price: req.body.price,
                max_weight: req.body.max_weight,
                description: req.body.description
            }, {
                where: {
                    id: product.id
                }
            }).then(product1 => {
                return res.status(200).send({
                    message: "Update product successfully!"
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

exports.deleteProduct = (req, res) => {
    Toko.findOne({
        where: {
            id_owner: req.userId
        }
    }).then(toko => {
        if (!toko) {
            return res.status(404).send({
                message: "Toko not found! You don't have any store/toko."
            })
        }
        Product.destroy({
            where: {
                id_toko: toko.id,
                name: req.body.name
            }
        }).then(product => {
            return res.status(200).send({
                message: "Delete product successfully!"
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

exports.getProduct = (req, res) => {
    if (req.body.tokoName) {
        Toko.findAll({
            where: {
                name: {
                    [Op.substring]: req.body.tokoName
                }
            }
        }).then(toko => {
            if (!toko) {
                return res.status(404).send({
                    message: "Product not found!"
                })
            }

            Product.findAll({
                where: {
                    id_toko: toko.id,
                    name: {
                        [Op.substring]: req.body.product_name
                    }
                }
            }).then(product => {
                return res.status(200).send(product)
            }).catch(err => {
                message: err.message
            })
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else if (req.body.product_name && !req.body.tokoName) {
        Product.findAll({
            where: {
                name: {
                    [Op.substring]: req.body.product_name
                }
            }
        }).then(product => {
            return res.status(200).send(product)
        }).catch(err => {
            message: err.message
        })
    } else {
        Product.findAll()
            .then(product => {
                return res.status(200).send(product)
            }).catch(err => {
                return res.status(500).send({
                    message: err.message
                })
            })
    }
};