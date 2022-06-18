module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        isAdmin: {
            type: Sequelize.BOOLEAN
        },
        isSeller: {
            type: Sequelize.BOOLEAN
        },
        isCustomer: {
            type: Sequelize.BOOLEAN
        }
    });
    return User;
}