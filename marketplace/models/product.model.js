module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        id_toko: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        },
        max_weight: {
            type: Sequelize.FLOAT
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Product;
}