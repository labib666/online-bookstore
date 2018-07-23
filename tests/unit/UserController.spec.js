const sinon = require('sinon');
const chai = require('chai');
const chaiHTTP = require('chai-http');

const bcrypt = require('bcrypt');

let AuthController, server;
const User = require('../../app/models/User');
const dbconnection = require('../../database/dbconnection');

const sandbox = sinon.createSandbox();
const expect = chai.expect;
chai.use(chaiHTTP);

describe('Test for UserController:register', () => {
    // before and after each test
    let bcrypt_hashsync_stub, db_online_stub;

    beforeEach( (done) => {
        AuthController = require('../../app/controllers/AuthController');
        sandbox.stub(AuthController,'getUserData')
            .callsFake( (req,res,next) => {
                next();
            });
        db_online_stub = sandbox.stub(dbconnection, 'isOnline')
            .callsFake( () => {
                return true;
            });
        bcrypt_hashsync_stub = sandbox.stub(bcrypt,'hashSync')
            .callsFake( () => {
                return 'password';
            });
        server = require('../../app');
        done();
    });

    afterEach( (done) => {
        sandbox.restore();
        done();
    });

    // tests
    it('placeholder', (done) => {
        expect(1+1).to.equal(2);
        done();
    });

    it('a valid user registration', (done) => {
        const user_findOne_stub = sandbox.stub(User, 'findOne')
            .callsFake( () => {
                return new Promise((resolve) => {
                    resolve(null);
                });
            });
        const user_create_stub = sandbox.stub(User, 'create')
            .callsFake( (user) => {
                return new Promise( (resolve) => {
                    user._id = '1234';
                    resolve(user);
                });
            });

        const server = require('../../app');
        chai.request(server)
            .post('/api/register')
            .send({
                name: 'test user',
                username: 'testuser',
                email: 'test@user.com',
                password: 'avalidpassword'
            })
            .end( (err,res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('user').eql('1234');
                expect(db_online_stub.callCount).to.equal(1);
                expect(bcrypt_hashsync_stub.callCount).to.equal(1);
                expect(user_findOne_stub.callCount).to.equal(1);
                expect(user_create_stub.callCount).to.equal(1);
                done();
            });
    });

    it('user already exists', (done) => {
        const user_findOne_stub = sandbox.stub(User, 'findOne')
            .callsFake( (user) => {
                return new Promise((resolve) => {
                    resolve(user);
                });
            });
        const user_create_stub = sandbox.stub(User, 'create')
            .callsFake( (user) => {
                return new Promise( (resolve) => {
                    user._id = '1234';
                    resolve(user);
                });
            });
        
        chai.request(server)
            .post('/api/register')
            .send({
                name: 'test user',
                username: 'testuser',
                email: 'test@user.com',
                password: 'avalidpassword'
            })
            .end( (err,res) => {
                expect(res).to.have.status(409);
                expect(db_online_stub.callCount).to.equal(1);
                expect(bcrypt_hashsync_stub.callCount).to.equal(1);
                expect(user_findOne_stub.callCount).to.equal(1);
                expect(user_create_stub.callCount).to.equal(0);
                done();
            });
    });

    it('invalid name should not be allowed', (done) => {
        const user_findOne_stub = sandbox.stub(User, 'findOne')
            .callsFake( () => {
                return new Promise((resolve) => {
                    resolve(null);
                });
            });
        const user_create_stub = sandbox.stub(User, 'create')
            .callsFake( (user) => {
                return new Promise( (resolve) => {
                    user._id = '1234';
                    resolve(user);
                });
            });
        
        const server = require('../../app');
        chai.request(server)
            .post('/api/register')
            .send({
                name: 'test123user',
                username: 'testuser',
                email: 'test@user.com',
                password: 'avalidpassword'
            })
            .end( (err,res) => {
                expect(res).to.have.status(422);
                expect(db_online_stub.callCount).to.equal(1);
                expect(bcrypt_hashsync_stub.callCount).to.equal(0);
                expect(user_findOne_stub.callCount).to.equal(0);
                expect(user_create_stub.callCount).to.equal(0);
                done();
            });
    });
});
