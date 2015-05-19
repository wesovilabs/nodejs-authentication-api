"use strict";

module.exports = function(sequelize, DataTypes) {
    logging: console.log
    var Account = sequelize.define("Account", {
        username:   DataTypes.STRING,
        password:   DataTypes.STRING,
        salt:       DataTypes.STRING,
        fullName:   DataTypes.STRING,
        status:     DataTypes.ENUM('REGISTERED','ACTIVE','CENSURED','CANCELED'),
        type:       DataTypes.ENUM('USER','ADMIN')
    });
    return Account;
};