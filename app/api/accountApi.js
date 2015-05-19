/**
 * Created by Ivan on 8/5/15.
 */

var models  = require('../models');
var crypto  = require('../util/cryptoUtils');

exports.authenticate = function(req,res,next){
    var account = accountAuthenticationValidation(req);
    var errors = req.validationErrors();
    if (errors) {
        res.status(400);
        res.json({errors:errors});
        next();
    }else {
        models.Account.find({ where: { username : req.body.username}})
        .then(function (account) {
            if (account == null) {
                res.status(404);
                res.json({"errors":[{"param":"username","msg":"notfound","value":req.body.username}]});
                next();
            } else {
                if(crypto.encryptPassword(account.salt,req.body.password)==account.password){
                    res.status(200);
                    res.json(account);
                    next();
                }else{
                    res.status(401);
                    res.json({"errors":[{"param":"credentials","msg":"invalid"}]});
                    next();
                }
            }
        });
    }
}


exports.createAccount = function(req,res,next){
    console.log('create account with following details: '+req.body);
    accountValidation(req);
    var errors = req.validationErrors();
    if (errors) {
        res.status(400);
        res.json({errors:errors});
        next();
    }else{
        req.body.salt = crypto.makeSalt();
        req.body.password = crypto.encryptPassword(req.body.password,req.body.salt);
        models.Account.create(req.body)
        .then(function(account) {
            res.status(201);
            res.json(prepareAccountResponse(account,req));
            next();
        });
    }
};

function accountValidation(req){
    req.checkBody('username','required').notEmpty();
    if(req.body.username){
        req.checkBody('username','format').isEmail();
    }
    req.checkBody('password','required').notEmpty();
    if(req.body.password){
        req.checkBody('password','format').len(6,20);
    }
    req.checkBody('fullName','required').notEmpty();
    if(req.body.password){
        req.checkBody('password','format').len(2,80);
    }
}

function accountAuthenticationValidation(req){


    req.checkBody('username','required').notEmpty();
    if(req.body.username){
        req.checkBody('username','format').isEmail();
    }
    req.checkBody('password','required').notEmpty();
    if(req.body.password){
        req.checkBody('password','format').len(6,20);
    }
}
function prepareAccountResponse(account,req){
    var accountResponse = {};
    var publicId = crypto.generatePublicId(''+account.id);
    accountResponse.publicId = publicId;
    accountResponse.username = account.username;
    accountResponse.fullName = account.fullName;
    accountResponse.gender = account.gender||'';
    accountResponse.birthday = account.birthday||'';
    accountResponse.links = [
        createLink('self','GET','http://'+req.hostname+':7654/api/v1/accounts/'+publicId),
        createLink('delete','DELETE','http://'+req.hostname+':7654/api/v1/accounts/'+publicId),
        createLink('update','PUT','http://'+req.hostname+':7654/api/v1/accounts/'+publicId)
    ]
    return accountResponse;
}

createLink = function(rel,method,href){
    return {
        'rel':rel,
        'method':method,
        'href': href
    }
}