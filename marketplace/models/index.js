const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize, Sequelize);
db.trans = require("../models/trans.model")(sequelize, Sequelize);
db.toko = require("../models/toko.model")(sequelize, Sequelize);
db.product = require("../models/product.model")(sequelize, Sequelize);

module.exports = db;