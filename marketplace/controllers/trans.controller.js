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

exports.makeOrder = (req, res) => {
    Product.findOne({
        where: {
            name: req.body.product_name
        }
    }).then(product => {
        Toko.findOne({
            where: {
                id: product.id_toko
            }
        }).then(toko => {
            Trans.create({
                id_buyer: req.userId,
                id_seller: toko.id_owner,
                id_product: product.id,
                amount: req.body.amount,
                total: (parseFloat(req.body.amount) * parseFloat(product.price)),
                paymentwith: req.body.payment_method,
                pickUp_address: req.body.address,
                deliver_address: req.body.address,
                isPickedUp: 0,
                isPaid: 0,
                isShipped: 0,
                isDelivered: 0
            }).then(trans => {
                return res.status(200).send({
                    message: "Order submitted! Please process the payment.",
                    detail: {
                        product: product.name,
                        total_price: trans.total,
                        payment_method: trans.paymentwith
                    }
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

exports.makePayment = (req, res) => {
    const emoney = ["Buski Coins", "KCN Pay", "Gallecoins", "CuanIND", "MoneyZ", "Payfresh", "PadPay", "PayPhone", "Talangin", "PeacePay"];
    Trans.findOne({
        where: {
            [Op.and]: [
                { id_buyer: req.userId },
                { isPaid: false }
            ]
        }
    }).then(trans => {
        if (!trans) {
            return res.status(404).send({
                message: "You don't have pending payment."
            })
        }
        switch (trans.paymentwith) {
            case "MoneyZ":
                axios.post('https://moneyz-kelompok6.herokuapp.com/api/login', {
                    phone: req.body.phone,
                    password: req.body.password
                }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://moneyz-kelompok6.herokuapp.com/api/user/transferTo', {
                        tujuan: "081359781288",
                        amount: String(trans.total),
                        emoney: "ECoin"
                    }, {
                        headers: {
                            Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "Transfer Successfull!"
                        if (successT.localeCompare(response1.data.message) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using MoneyZ Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                        res.status(500).send(err)
                    })
                }).catch(err => {
                    res.status(500).send(err)
                })
                break;
            case "PeacePay":
                axios.post('https://e-money-kelompok-12.herokuapp.com/api/login', {
                    number: req.body.phone,
                    password: req.body.password
                }).then(response => {
                    let etoken = response.data.token;
                    let totalT = String(trans.total)
                    axios.post('https://e-money-kelompok-12.herokuapp.com/api/ecoin', {
                        tujuan: "081359781288",
                        amount: totalT
                    }, {
                        headers: {
                            Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        // res.status(200).send(response1.data.msg)
                        let successT = "Transfer berhasil dilakukan."
                        if (successT.localeCompare(response1.data.msg) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using Peace Pay Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                        res.status(500).send(err)
                    })
                }).catch(err => {
                    res.status(500).send(err)
                })
                break;
            case "PayPhone":
                axios.post('http://fp-payphone.herokuapp.com/public/api/login', qs.stringify({
                    telepon: req.body.phone,
                    password: req.body.password
                  })).then(response => {
                    let etoken = response.data.token;
                    axios.post('http://fp-payphone.herokuapp.com/public/api/transfer', qs.stringify({
                      telepon: "081359781288",
                      jumlah: trans.total,
                      emoney: "ECoin"
                    }), {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "Transer Berhasil"
                        if (successT.localeCompare(response1.data.message) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using PayPhone Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "Buski Coins":
                axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/publics/login', qs.stringify({
                    username: req.body.username,
                    password: req.body.password
                  })).then(response => {
                    let etoken = response.data.message.token;
                    axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/admin/transfer', qs.stringify({
                      nomer_hp: response.data.message.data.nomer_hp,
                      nomer_hp_tujuan: "081359781288",
                      e_money_tujuan: "ECoin",
                      amount: trans.total,
                      description: "Pembayaran AyoLaundry melalui Buski Coins"
                    }), {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "transfer ke ECoin berhasil"
                        if (successT.localeCompare(response1.data.message.success) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using Buski Coins Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err.message)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "CuanIND":
                axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/user/login', {
                    notelp: req.body.phone,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data;
                    axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/transfer/ecoin10', {
                      target: "081359781288",
                      amount: trans.total
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "berhasil"
                        if (successT.localeCompare(response1.data) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using CuanIND Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "KCN Pay": //ini masih error katanya emoney belum kedaftar
                axios.post('https://kecana.herokuapp.com/login', {
                    email: req.body.email,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data;
                    axios.post('https://kecana.herokuapp.com/transferemoneylain', {
                      id: "44",
                      nohp: "081359781288",
                      nominaltransfer: trans.total,
                      emoneytujuan: "e-COIN"
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "Transfer Successfull."
                        if (successT.localeCompare(response1.data) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using KCN Pay Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "Payfresh":
                axios.post('https://payfresh.herokuapp.com/api/login', {
                    email: req.body.email,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://payfresh.herokuapp.com/api/user/ecoin', {
                      phone2: "081359781288",
                      amount: String(req.body.amount),
                      description: "Pembayaran AyoLaundry using Payfresh."
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "Transfer Successfull."
                        if (successT.localeCompare(response1.data.message) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using Payfresh Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "PadPay":
                axios.post('https://mypadpay.xyz/padpay/api/login.php', {
                    email: req.body.email,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data.Data.jwt;
                    axios.post('https://mypadpay.xyz/padpay/api/coin/ecoin.php', {
                        email: req.body.email,
                        password: req.body.password,
                        jwt: etoken,
                        tujuan: "081359781288",
                        jumlah: String(trans.total),
                        description: "AyoLaundry payment using PadPay"
                    }).then(response1 => {
                        let successT = "saldo tidak cukup"
                        if (successT.localeCompare(response1.data.message) != 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using Payfresh Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                        res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
            case "Talangin":
                axios.post('https://e-money-kelomok-11.000webhostapp.com/api/login.php', {
                    email: req.body.email,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data.jwt;
                    axios.post('https://e-money-kelomok-11.000webhostapp.com/api/transferin.php', {
                      jwt: etoken,
                      pengirim: "081359781268",
                      penerima: "081359781288",
                      emoney: "ECoin",
                      jumlah: String(req.body.amount)
                    }).then(response1 => {
                        Trans.update({ isPaid: true }, {
                            where: {
                                id: trans.id
                            }
                        }).then(trans1 => {
                            return res.status(200).send({
                                message: "Payment using Talangin Success!"
                            })
                        }).catch(err => {
                            return res.status(500).send({
                                message: err.message
                            })
                        })
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case "Gallecoins":
                axios.post('https://gallecoins.herokuapp.com/api/users', {
                    username: req.body.username,
                    password: req.body.password
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://gallecoins.herokuapp.com/api/transfer/ecoin', {
                      description: "Payment AyoLaundry using Gallecoins",
                      phone_target: "081359781288",
                      amount: trans.total,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                        let successT = "Transfer success"
                        if (successT.localeCompare(response1.data.message) == 0) {
                            Trans.update({ isPaid: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    message: "Payment using Gallecoins Success!"
                                })
                            }).catch(err => {
                                return res.status(500).send({
                                    message: err.message
                                })
                            })
                        }
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case "ECoin":
                    axios.post('https://ecoin10.my.id/api/masuk', {
                        phone: req.body.phone,
                        password: req.body.password
                      }).then(response => {
                        let etoken = response.data.token;
                        axios.post('https://ecoin10.my.id/api/transfer', {
                          description: "Payment AyoLaundry using ECoin",
                          phone2: "081359781288",
                          amount: trans.total,
                        }, {
                            headers: {
                              Authorization: `Bearer ${etoken}`
                            }
                        }).then(response1 => {
                            // res.status(200).send(response1.data)
                            let successT = "Transfer Successfull."
                            if (successT.localeCompare(response1.data.message) == 0) {
                                Trans.update({ isPaid: true }, {
                                    where: {
                                        id: trans.id
                                    }
                                }).then(trans1 => {
                                    return res.status(200).send({
                                        message: "Payment using ECoin Success!"
                                    })
                                }).catch(err => {
                                    return res.status(500).send({
                                        message: err.message
                                    })
                                })
                            }
                        }).catch(err => {
                          res.status(500).send(err)
                        });
                      }).catch(err => {
                        res.status(500).send(err)
                      }); break;
            default:
                break;
        }
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
}

exports.pickedUp = (req, res) => {
    if (req.isSeller == true) {
        Toko.findOne({
            where: {
                id_owner: req.userId
            }
        }).then(toko => {
            Trans.findOne({
                where: {
                    [Op.and]: [
                        { id_seller: req.userId },
                        { isPickedUp: false }
                    ]
                }
            }).then(trans => {
                const pickup = "Picked Up";
                if (pickup.localeCompare(req.body.status) == 0) {
                    Trans.update({ isPickedUp: true }, {
                        where: {
                            id: trans.id
                        }
                    }).then(trans1 => {
                        return res.status(200).send({
                            order_num: trans.id,
                            picked_from: trans.pickUp_address,
                            message: "Order picked up and being processes."
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
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else {
        return res.status(401).send({
            message: "Only seller can access this information!"
        })
    }
}

exports.shipped = (req, res) => {
    if (req.isSeller == true) {
        Toko.findOne({
            where: {
                id_owner: req.userId
            }
        }).then(toko => {
            Trans.findOne({
                where: {
                    [Op.and]: [
                        { id_seller: req.userId },
                        { isShipped: false }
                    ]
                }
            }).then(trans => {
                const ship = "Shipping to Customer";
                if (ship.localeCompare(req.body.status) == 0) {
                    Trans.update({ isShipped: true }, {
                        where: {
                            id: trans.id
                        }
                    }).then(trans1 => {
                        return res.status(200).send({
                            order_no: trans.id,
                            shipped_to: trans.deliver_address,
                            message: "Order is ready and sent to customer."
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
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else {
        return res.status(401).send({
            message: "Only seller can access this information!"
        })
    }
}

exports.delivered = (req, res) => {
    Trans.findOne({
        where: {
            [Op.and]: [
                { id_buyer: req.userId },
                { isDelivered: false }
            ]
        }
    }).then(trans => {
        const ship = "Delivered";
        if (ship.localeCompare(req.body.status) == 0) {
            Toko.findOne({
                where: {
                    id: 4
                }
            }).then(toko => {
                if (parseFloat(toko.amount) <= 100000) {
                    Toko.update({amount: 100000000}, {
                        where: {
                            id: 4
                        }
                    }).then(toko2 => {

                    }).catch(err => {
                        return res.status(500).send({
                            message: err.message
                        })
                    })
                }

                Toko.findOne({
                    where: {
                        id: trans.id_seller
                    }
                }).then(toko1 => {
                    let newcre = parseFloat(toko1.amount) + parseFloat(trans.total);
                    let newcre1 = parseFloat(toko.amount) - parseFloat(trans.total);

                    Toko.update({amount: newcre1}, {
                        where: {
                            id: 4
                        }
                    }).then(toko3 => {
                        Toko.update({amount: newcre}, {
                            where: {
                                id: trans.id_seller
                            }
                        }).then(toko4 => {
                            Trans.update({ isDelivered: true }, {
                                where: {
                                    id: trans.id
                                }
                            }).then(trans1 => {
                                return res.status(200).send({
                                    order_no: trans.id,
                                    delivered_to: trans.deliver_address,
                                    message: "Order delivered."
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
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        })
    })
}

exports.getHistory = (req, res) => {
    if (req.isAdminT == true) {
        Trans.findAll()
        .then(trans => {
            return res.status(200).send(trans)
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    } else {
        Trans.findAll({
            where: {
                id_buyer: req.userId
            }
        }).then(trans => {
            return res.status(200).send(trans)
        }).catch(err => {
            return res.status(500).send({
                message: err.message
            })
        })
    }
}