/**
 * Created by Ivan on 4/5/15.
 */
var monitorApi = require('monitorApi');
var accountApi = require('accountApi');

module.exports = function (app) {

    app.get('/monitor/status',monitorApi.status);

    app.post('/accounts',accountApi.createAccount);
    app.post('/accounts/authenticate',accountApi.authenticate);
}