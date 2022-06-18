module.exports = (sequelize, Sequelize) => {
    const Trans = sequelize.define("transaction", {
        transmethod: {
            type: Sequelize.STRING
        },
        id_sender: {
            type: Sequelize.INTEGER
        },
        id_receiver: {
            type: Sequelize.INTEGER
        },
        merchant: {
            type: Sequelize.STRING
        },
        transfermethod: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.FLOAT
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Trans;
}