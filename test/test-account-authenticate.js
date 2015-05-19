/**
 * Created by Ivan on 9/5/15.
 */
var should = require('should');
var request = require('supertest');
var app = require('../server');
var context = describe;
var models  = require('../app/models');

context('Account Authentication Service',function(){
    context('POST /accounts/authenticate', function () {
        context('Check response when some required fields are not sent.', function () {
            it('should response BAD REQUEST & the error details when body is empty ', function (done) {
                var credentials = {};
                request(app)
                    .post('/accounts/authenticate')
                    .send(credentials)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'username', msg: 'required' },{ param: 'password', msg: 'required' }]})
                    .end(done);
            });
            it('should response BAD REQUEST & the error details when username is empty ', function (done) {
                var credentials = {password:"secret"};
                request(app)
                    .post('/accounts/authenticate')
                    .send(credentials)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'username', msg: 'required' }]})
                    .end(done);
            });
            it('should response BAD REQUEST & the error details when password is empty ', function (done) {
                var credentials = {username:"email@mail.com"};
                request(app)
                    .post('/accounts/authenticate')
                    .send(credentials)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'password', msg: 'required' }]})
                    .end(done);
            });
        });

        context('Check response when credentials are not valid..', function () {
            it('should response UnAuthorized & return a error response', function (done) {
                var account = {fullName: 'John Doe', username: 'email1@email.com', password: 'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .end(function(err, res) {
                        if (err) return done(err);
                        var credentials = {username: account.username, password: 'badPassword'};
                        request(app)
                            .post('/accounts/authenticate')
                            .send(credentials)
                            .set('Content-Type', 'application/json')
                            .expect(401)
                            .expect({"errors": [{"param": "credentials", "msg": "invalid"}]})
                            .end(done);
                    });
            });
            models.Account.destroy({truncate:true});

        });


        context('Check response when user is not registered yet..', function () {
            it('should response Not found & return a error response', function (done) {
                var account = {fullName: 'John Doe', username: 'email1@email.com', password: 'secret'};
                var credentials = {username: 'notfound@email.com', password: 'badPassword'};
                request(app)
                    .post('/accounts/authenticate')
                    .send(credentials)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .expect({"errors": [{"param": "username", "msg": "notfound", "value": credentials.username}]})
                    .end(done);
            });

        });

        context('Check response when user is authenticated correctly.', function () {
            it('should response UnAuthorized & return account details', function (done) {
                var account = {fullName: 'John Doe', username: 'email2@email.com', password: 'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .end(function(err, res){
                        if (err) return done(err);
                        var credentials = {username: account.username, password: account.password};
                        request(app)
                            .post('/accounts/authenticate')
                            .send(credentials)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function(err,res) {
                                if (err) return done(err);
                                res.body.publicId.should.match(/\b[0-9a-f]{5,40}\b/);
                                res.body.username.should.equal(account.username);
                                res.body.fullName.should.equal(account.fullName);
                            });
                            done();
                    });
            });
            models.Account.destroy({truncate:true});
        });
    });
});