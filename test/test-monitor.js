var should = require('should');
var request = require('supertest');
var app = require('../server');
var context = describe;

describe('Status Service',function(){
    describe('GET /monitor/status - Test Server status', function () {
        describe('Check http status code & body response', function () {
            it('should response 200 and all the services should be running', function (done) {
                request(app)
                    .get('/monitor/status')
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)
                    .expect({
                        'server':'0'
                    }).end(done);
            });
        });
    });
});