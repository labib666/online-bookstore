const sinon = require('sinon');
const chai = require('chai');
const bcrypt = require('bcrypt');

const User = require('../../app/models/User');
const UC = require('../../app/controllers/UserController');

let sandbox = sinon.createSandbox();
let expect = chai.expect;

describe('Test for UserController:register', function () { 
    let req, res, resJsonSpy, resStatusSpy, nextSpy;
    
    // before each test
    beforeEach( function (done) {
        sandbox.stub(bcrypt,'hashSync')
            .callsFake( function () {
                return 'password';
            });
        req = {
            user: {
                isModerator: true
            },
            body: {
                name: 'test name',
                username: 'testname',
                email: 'abc@abc.com',
                password: '0123456789'
            }
        };
        resJsonSpy = sandbox.spy();
        res = {
            json: resJsonSpy
        };
        resStatusSpy = sandbox.stub().returns(res);
        nextSpy =  sandbox.spy();
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

        UC.register(req, { status: resStatusSpy }, nextSpy);
        
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(0);
            expect(resJsonSpy.callCount).to.equal(1);
            expect(resJsonSpy.args[0][0].user).to.equal('1234');
            done();
        }, 250);
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
        
        UC.register(req, { status: resStatusSpy }, nextSpy);
            
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(1);
            expect(resJsonSpy.callCount).to.equal(0);
            expect(nextSpy.args[0][0].status).to.equal(409);
            done();
        }, 250);
    });
});
