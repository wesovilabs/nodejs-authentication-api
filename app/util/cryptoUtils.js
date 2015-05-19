/**
 * Created by Ivan on 4/5/15.
 */
var crypto = require('crypto');

var publicIdSalt = 'ddaf160763b210bbc9c2479b4ea428edc4f5ed11'

/**
 * Return random value.
 * @returns {string}
 */
makeSalt =  function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
}

encryptPassword = function (password,salt) {
    if (!password) return '';
    try {
        return crypto
            .createHmac('sha1', salt)
            .update(password)
            .digest('hex');
    } catch (err) {
        return '';
    }
}

generatePublicId = function(id){
    if (!id) return '';
    try {
        return crypto
            .createHmac('sha1', publicIdSalt)
            .update(id)
            .digest('hex');
    } catch (err) {
        return err;
    }
}

module.exports.makeSalt = makeSalt;
module.exports.encryptPassword =encryptPassword;
module.exports.generatePublicId =generatePublicId;