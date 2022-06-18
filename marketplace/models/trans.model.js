module.exports = (sequelize, Sequelize) => {
    const Trans = sequelize.define("transaction", {
        id_buyer: {
            type: Sequelize.INTEGER
        },
        id_seller: {
            type: Sequelize.INTEGER
        },
        id_product: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.FLOAT
        },
        pickUp_address: {
            type: Sequelize.STRING
        },
        deliver_address: {
            type: Sequelize.STRING
        },
        paymentwith: {
            type: Sequelize.STRING
        },
        isPickedUp: {
            type: Sequelize.BOOLEAN
        },
        isPaid: {
            type: Sequelize.BOOLEAN
        },
        isShipped: {
            type: Sequelize.BOOLEAN
        },
        isDelivered: {
            type: Sequelize.BOOLEAN
        }
    });
    return Trans;
}