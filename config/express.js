/**
 * Created by Ivan on 4/5/15.
 */
var express = require('express');
var session = require('express-session');
var validator = require('express-validator');
var compression = require('compression');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var pkg = require('../package.json');


var cookieSecretValue = 's3cr3t!5102';


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


module.exports = function (app) {
    app.use(logger('dev'));
    app.use(compression({
        threshold: 512
    }));

    app.use(bodyParser.json());
    app.use(validator());

    app.use(cookieParser());
    app.use(cookieSession({ secret: cookieSecretValue }));
    app.use(allowCrossDomain);
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: pkg.name
    }));


};