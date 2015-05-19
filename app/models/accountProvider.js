/**
 * Created by Ivan on 9/5/15.
 */
module.exports = function(sequelize, DataTypes) {
    logging: console.log
    var AccountProvider = sequelize.define("AccountProvider", {
        providerId: DataTypes.STRING,
        provider: DataTypes.ENUM('FACEBOOK','TWITTER')
    }, {
        classMethods: {
            associate: function(models) {
                AccountProvider.belongsTo(models.Account,{foreignKey:'accountId'})
            }
        }
    });
    return AccountProvider;
};