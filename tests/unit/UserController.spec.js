const sinon = require('sinon');
const chai = require('chai');
const bcrypt = require('bcrypt');

const User = require('../../app/models/User');
const UC = require('../../app/controllers/UserController');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

describe('Test for UserController:register', function () {
    let req, res, next;
    
    // before each test
    beforeEach( function (done) {
        sandbox.stub(bcrypt,'hashSync')
            .callsFake( function () {
                return 'password';
            });
        req = {
            body: {
                name: 'test name',
                username: 'testname',
                email: 'email@gmail.com',
                password: 'password'
            }
        };
        res = {
            status: sandbox.stub().returns(res),
            json: sandbox.stub().callsFake(
                function(response) {
                    console.log(response);
                })
        };
        next = sandbox.stub().callsFake(
            function(response) {
                console.log(response);
            });
        done();
    });

    // after each test
    afterEach( function (done) {
        sandbox.restore();
        done();
    });

    // tests

    it('placeholder', function (done) {
        expect(1+1).to.equal(2);
        done();
    });

    it('a valid user registration', function (done) {
        sandbox.stub(User, 'findOne')
            .callsFake( function () {
                return new Promise(function (resolve) {
                    resolve(null);
                });
            });
        sandbox.stub(User, 'create')
            .callsFake( function (user) {
                return new Promise( function (resolve) {
                    user._id = '1234';
                    resolve(user);
                });
            });

        UC.register(req, res, next);
        
        setTimeout(function() {
            //expect(next.callcount).to.equal(0);
            //expect(res.json.callcount).to.equal(1);
            done();
        }, 1000);
    });

    it('user already exists', function (done) {
        sandbox.stub(User, 'findOne')
            .callsFake( function (user) {
                return new Promise( function (resolve) {
                    resolve(user);
                });
            });
        sandbox.stub(User, 'create')
            .callsFake( function (user) {
                return new Promise( function (resolve) {
                    user._id = '1234';
                    resolve(user);
                });
            });
        
        UC.register(req, res, next);

        done();
    });
});
