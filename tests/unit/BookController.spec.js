const sinon = require('sinon');
const chai = require('chai');

let AuthController, server;
const Book = require('../../app/models/Book');
const dbconnection = require('../../database/dbconnection');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

describe('Test for BookController:addBook', () => {
    // before and after each test
    let db_online_stub;

    beforeEach( (done) => {
        AuthController = require('../../app/controllers/AuthController');
        sandbox.stub(AuthController,'getUserData').callsFake(
            (req,res,next) => {
                req.user = {
                    _id: 'user id',
                    isModerator: true
                };
                next();
            });
        db_online_stub = sandbox.stub(dbconnection, 'isOnline')
            .callsFake( () => {
                return true;
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

    it('a valid book registration', (done) => {
        const book_findOne_stub = sandbox.stub(Book, 'findOne')
            .callsFake( () => {
                return new Promise((resolve) => {
                    resolve(null);
                });
            });
        const book_create_stub = sandbox.stub(Book, 'create')
            .callsFake( (book) => {
                return new Promise( (resolve) => {
                    book._id = '1234';
                    resolve(book);
                });
            });

        const server = require('../../app');
        chai.request(server)
            .post('/api/book')
            .send({
                title: 'test book',
                author: 'test author',
                ISBN: '006245773X'
            })
            .end( (err,res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('book').eql('1234');
                expect(db_online_stub.callCount).to.equal(1);
                expect(book_findOne_stub.callCount).to.equal(1);
                expect(book_create_stub.callCount).to.equal(1);
                done();
            });
    });

    it('book already exists', (done) => {
        const book_findOne_stub = sandbox.stub(Book, 'findOne')
            .callsFake( (book) => {
                return new Promise((resolve) => {
                    resolve(book);
                });
            });
        const book_create_stub = sandbox.stub(Book, 'create')
            .callsFake( (book) => {
                return new Promise( (resolve) => {
                    book._id = '1234';
                    resolve(book);
                });
            });
        
        chai.request(server)
            .post('/api/book')
            .send({
                title: 'test book',
                author: 'test author',
                ISBN: '006245773X'
            })
            .end( (err,res) => {
                expect(res).to.have.status(409);
                expect(db_online_stub.callCount).to.equal(1);
                expect(book_findOne_stub.callCount).to.equal(1);
                expect(book_create_stub.callCount).to.equal(0);
                done();
            });
    });

    it('invalid title should not be allowed', (done) => {
        const book_findOne_stub = sandbox.stub(Book, 'findOne')
            .callsFake( () => {
                return new Promise((resolve) => {
                    resolve(null);
                });
            });
        const book_create_stub = sandbox.stub(Book, 'create')
            .callsFake( (book) => {
                return new Promise( (resolve) => {
                    book._id = '1234';
                    resolve(book);
                });
            });
        
        const server = require('../../app');
        chai.request(server)
            .post('/api/book')
            .send({
                title: '',
                author: 'test author',
                ISBN: '006245773X'
            })
            .end( (err,res) => {
                expect(res).to.have.status(422);
                expect(db_online_stub.callCount).to.equal(1);
                expect(book_findOne_stub.callCount).to.equal(0);
                expect(book_create_stub.callCount).to.equal(0);
                done();
            });
    });
});
