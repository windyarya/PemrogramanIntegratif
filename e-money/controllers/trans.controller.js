const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Trans = db.trans;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var axios = require("axios");
var qs = require("querystring");

exports.saldo = (req, res) => {
  User.findOne({
    where: {
      phone: req.phoneT
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({
        phone: user.phone,
        credit: user.credits,
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.riwayat = (req, res) => {
  Trans.findAll({
    where: {
      [Op.or]: [{ 
        id_sender: req.userId
      }, { 
        id_receiver: req.userId
      }]
    }
  })
    .then(trans => {
      if (!trans) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send(trans);

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.pembayaran = (req, res) => {
  merchant = [];
  User.findOne({
    where: {
      phone: req.phoneT
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      Trans.create({
        transmethod: "payment",
        id_sender: req.userId,
        id_receiver: 4,
        merchant: "AyoLaundry",
        amount: req.body.amount,
        description: req.body.description
      }).then (trans => {
        let ncre = parseFloat(user.credits) - parseFloat(req.body.amount);
        let flag = 0;
        User.update({
          credits: ncre
        }, {
          where: {
            id: req.userId
          }
        }).then(user1 => {
          User.findOne({
            where: {
              phone: "081122334455"
            }
          }).then(user2 => {
            let ncre1 = parseFloat(user2.credits) + parseFloat(req.body.amount);
            User.update({
              credits: ncre1
            }, {
              where: {
                id: user2.id
              }
            }).then(user3 => {
                res.status(200).send({
                  phone: user.phone,
                  merchant: trans.merchant,
                  amount: trans.amount,
                  message: "Payment Successfull!"
                });
            }).catch(err => {
              res.status(500).send({message: err.message});
            })
          })
        }).catch(err => {
          res.status(500).send({message: err.message});
        })
      }).catch(err => {
        res.status(500).send({ message: err.message });
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.isiulang = (req, res) => {
  User.findOne({
    where: {
      phone: req.phoneT
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      
      User.findOne({
        where: {
          phone: req.body.phone
        }
      }).then(user1 => {
        let ncre = parseFloat(user1.credits) + parseFloat(req.body.amount);
        User.update({
          credits: ncre
        }, {
          where: {
            id: user1.id
          }
        }).then(user2 => {
          Trans.create({
            transmethod: "topup",
            id_sender: 1,
            id_receiver: user1.id,
            amount: req.body.amount,
            description: req.body.description
          }).then(trans => {
            res.status(200).send({
              phone: user1.phone,
              amount: trans.amount,
              credits: user2.credits,
              message: "Top Up Successfull!"
            });
          }).catch(err => {
            res.status(500).send({ message: err.message });
          })
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }).catch(err => {
        res.status(500).send({ message: err.message });
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.transfer = (req, res) => {
  const emoney = ["Buski Coins", "KCN Pay", "Gallecoins", "CuanIND", "MoneyZ", "Payfresh", "PadPay", "PayPhone", "Talangin", "PeacePay"];

  if (req.body.dest_emoney != null) {
    let num = -1;
    for (let i = 0; i < emoney.length; i++) {
      if (emoney[i].localeCompare(req.body.dest_emoney) == 0) {
        num = i;
        break;
      }
    }

    User.findOne({
      where: {
        phone: req.phoneT
      }
    }).then(user => {
      let ncre = parseFloat(user.credits) - parseFloat(req.body.amount);
      
      if (user.credits < req.body.amount) {
        return res.status(400).send({
          message: "Insufficient Fund!"
        })
      }

      User.update({
        credits: ncre
      }, {
        where: {
          id: user.id
        }
      }).then(user1 => {
        User.findOne({
          where: {
            phone: "082133445566"
          }
        }).then(user2 => {
          let ncre1 = parseFloat(user2.credits) + parseFloat(req.body.amount);

          User.update({
            credits: ncre1
          }, {
            where: {
              id: user2.id
            }
          }).then(user3 => {
            Trans.create({
              transmethod: "transfer",
              id_sender: user.id,
              id_receiver: user2.id,
              transfermethod: 2,
              merchant: req.body.dest_emoney,
              amount: req.body.amount,
              description: req.body.description
            }).then(trans => {
              switch(num) {
                case 0: 
                  axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/publics/login', qs.stringify({
                    username: "ecoin10",
                    password: "ecoin123"
                  })).then(response => {
                    let etoken = response.data.message.token;
                    axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/admin/transfer', qs.stringify({
                      nomer_hp: response.data.message.data.nomer_hp,
                      nomer_hp_tujuan: req.body.phone2,
                      e_money_tujuan: "ECoin",
                      amount: req.body.amount,
                      description: req.body.description
                    }), {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err.message)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 1:
                  axios.post('https://kecana.herokuapp.com/login', {
                    email: "ecoin10@gmail.com",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data;
                    axios.post('https://kecana.herokuapp.com/transfer', {
                      id: "44",
                      nohp: req.body.phone2,
                      nominaltransfer: req.body.amount,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 2:
                  axios.post('https://gallecoins.herokuapp.com/api/users', {
                    username: "ecoin10",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://gallecoins.herokuapp.com/api/transfer', {
                      description: req.body.description,
                      phone: req.body.phone2,
                      amount: req.body.amount,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 3: 
                  axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/user/login', {
                    notelp: "081359781268",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data;
                    axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/transfer', {
                      target: req.body.phone2,
                      amount: req.body.amount,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 4: 
                  axios.post('https://moneyz-kelompok6.herokuapp.com/api/login', {
                    phone: "081359781268",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://moneyz-kelompok6.herokuapp.com/api/user/transfer', {
                      nomortujuan: req.body.phone2,
                      nominal: req.body.amount,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 5:
                  axios.post('https://payfresh.herokuapp.com/api/login', {
                    email: "ecoin10@gmail.com",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://payfresh.herokuapp.com/api/user/transfer/32', {
                      phone: req.body.phone2,
                      amount: String(req.body.amount),
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 6:
                  axios.post('https://mypadpay.xyz/padpay/api/login.php', {
                    email: "ecoin10@gmail.com",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.Data.jwt;
                    axios.post('https://mypadpay.xyz/padpay/api/transaksi.php/52', {
                      email: "ecoin10@gmail.com",
                      password: "ecoin123",
                      jwt: etoken,
                      tujuan: req.body.phone2,
                      jumlah: String(req.body.amount),
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 7:
                  axios.post('http://fp-payphone.herokuapp.com/public/api/login', qs.stringify({
                    telepon: "081359781268",
                    password: "ecoin123"
                  })).then(response => {
                    let etoken = response.data.token;
                    axios.post('http://fp-payphone.herokuapp.com/public/api/transfer', qs.stringify({
                      telepon: req.body.phone2,
                      jumlah: req.body.amount,
                      emoney: "ECoin"
                    }), {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 8:
                  axios.post('https://e-money-kelomok-11.000webhostapp.com/api/login.php', {
                    email: "ecoin10@gmail.com",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.jwt;
                    axios.post('https://e-money-kelomok-11.000webhostapp.com/api/transfer.php', {
                      jwt: etoken,
                      pengirim: "081359781268",
                      penerima: req.body.phone2,
                      jumlah: String(req.body.amount)
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                case 9:
                  axios.post('https://e-money-kelompok-12.herokuapp.com/api/login', {
                    number: "081359781268",
                    password: "ecoin123"
                  }).then(response => {
                    let etoken = response.data.token;
                    axios.post('https://e-money-kelompok-12.herokuapp.com/api/transfer', {
                      tujuan: req.body.phone2,
                      amount: req.body.amount,
                    }, {
                        headers: {
                          Authorization: `Bearer ${etoken}`
                        }
                    }).then(response1 => {
                      res.status(200).send(response1.data)
                    }).catch(err => {
                      res.status(500).send(err)
                    });
                  }).catch(err => {
                    res.status(500).send(err)
                  }); break;
                default:
                  res.status(400).send({
                    message: "E-money is not recognized!"
                  }); break;
              }
            }).catch(err => {
              res.status(500).send({
                status: "Transfer to Penampung Unsuccessful!",
                message: err.message
              })
            })
          }).catch(err => {
            res.status(500).send({ message: err.message });
          })
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }).catch(err => {
        res.status(500).send({ message: err.message});
      })
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  } else {
    User.findOne({
      where: {
        phone: req.phoneT
      }
    }).then(user => {
      let ncre = parseFloat(user.credits) - parseFloat(req.body.amount);
      
      if (user.credits < req.body.amount) {
        return res.status(400).send({
          message: "Insufficient Fund!"
        })
      }

      User.update({
        credits: ncre
      }, {
        where: {
          id: user.id
        }
      }).then(user1 => {
        User.findOne({
          where: {
            phone: req.body.phone2
          }
        }).then(user2 => {
          let ncre1 = parseFloat(user2.credits) + parseFloat(req.body.amount);

          User.update({
            credits: ncre1
          }, {
            where: {
              id: user2.id
            }
          }).then(user3 => {
            Trans.create({
              transmethod: "transfer",
              id_sender: user.id,
              id_receiver: user2.id,
              transfermethod: 1,
              amount: req.body.amount,
              description: req.body.description
            }).then(trans => {
              res.status(200).send({
                sender: trans.id_sender,
                receiver: trans.id_receiver,
                amount: trans.amount,
                message: "Transfer Successfull!"
              });
            }).catch(err => {
              res.status(500).send({
                status: "Transfer Unsuccessful!",
                message: err.message
              })
            })
          }).catch(err => {
            res.status(500).send({ message: err.message });
          })
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }).catch(err => {
        res.status(500).send({ message: err.message});
      })
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  }
};