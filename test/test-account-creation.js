/**
 * Created by Ivan on 9/5/15.
 */
var should = require('should');
var request = require('supertest');
var app = require('../server');
var context = describe;
var models  = require('../app/models');

context('Account Creation Service',function(){
    context('POST /accounts', function () {
        context('Check response when some required fields are not sent.', function () {
            it('should response BAD REQUEST & the error details when fullName is empty ', function (done) {
                var account = {username:'john.doe@mail.com',password:'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'fullName', msg: 'required' }]})
                    .end(done);
            });
            it('should response BAD REQUEST & the error details when username is empty ', function (done) {
                var account = {fullName:'John Doe',password:'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'username', msg: 'required' }]})
                    .end(done);
            });
            it('should response BAD REQUEST & the error details when username & password are empty ', function (done) {
                var account = {fullName:'John Doe'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{ param: 'username', msg: 'required' },{ param: 'password', msg: 'required' }]})
                    .end(done);
            });
        });
        context('Check response when even though the required fields are sent, they have some invalid format.', function () {
            it('should response BAD REQUEST & the error details when username is not a valid email ', function (done) {
                var invalidEmail ='novalid.com';
                var account = {fullName: 'John Doe', username: invalidEmail, password: 'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(400)
                    .expect({errors:[{param: 'username', msg: 'format', value: invalidEmail}]})
                    .end(done);
            });

        });
        context('Check response when account is created successfully.', function () {
            it('should response CREATED & return a valid response', function (done) {
                var account = {fullName: 'John Doe', username: 'email@email.com', password: 'secret'};
                request(app)
                    .post('/accounts')
                    .send(account)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(201)
                    .end(function(err,res){
                        if (err) return done(err);
                        res.body.publicId.should.match(/\b[0-9a-f]{5,40}\b/);
                        res.body.username.should.equal(account.username);
                        res.body.fullName.should.equal(account.fullName);
                        /**
                        res.body.links.should.equal(
                            [
                                {
                                    'rel':'self',
                                    'method':'GET',
                                    'href':'http://127.0.0.1:7654/api/v1/accounts/'+res.body.publicId
                                },
                                {
                                    'rel':'delete',
                                    'method':'DELETE',
                                    'href':'http://127.0.0.1:7654/api/v1/accounts/'+res.body.publicId
                                },
                                {
                                    'rel':'update',
                                    'method':'PUT',
                                    'href':'http://127.0.0.1:7654/api/v1/accounts/'+res.body.publicId
                                }
                            ]
                        );
                         **/
                        done();
                    });
                models.Account.destroy({truncate:true});
            });

        });
    });

    /**
     * {
                            'username':'email@email.com',
     'fullName':'John Doe',
     'gender':'',
     'birthday':'',
     'links':
     }
     */
});