module.exports = (sequelize, Sequelize) => {
    const Toko = sequelize.define("toko", {
        id_owner: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        amount: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Toko;
}