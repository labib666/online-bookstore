const sinon = require('sinon');
const chai = require('chai');

const Book = require('../../app/models/Book');
const BC = require('../../app/controllers/BookController');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

describe('Test for BookController:addBook', function () {
    let req, res, next;

    // before each test
    beforeEach( function (done) {
        req = {
            user: {
                isModerator: true
            },
            body: {
                title: 'test name',
                author: 'testname',
                ISBN: '0123456789'
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

    it('a valid book registration', function (done) {
        sandbox.stub(Book, 'findOne')
            .callsFake( function () {
                return new Promise( function (resolve) {
                    resolve(null);
                });
            });
        sandbox.stub(Book, 'create')
            .callsFake( function (book) {
                return new Promise( function (resolve) {
                    book._id = '1234';
                    resolve(book);
                });
            });
        
        //console.log(req, res, next);
        BC.addBook(req, res, next);

        setTimeout(function() {
            //expect(next.called).to.be.true();
            //expect(res.json.callcount).to.equal(1);
            done();
        }, 1000);
    });

    it('book already exists', function (done) {
        sandbox.stub(Book, 'findOne')
            .callsFake( function (book) {
                return new Promise( function (resolve) {
                    resolve(book);
                });
            });
        sandbox.stub(Book, 'create')
            .callsFake( function (book) {
                return new Promise( function (resolve) {
                    book._id = '1234';
                    resolve(book);
                });
            });
        
        BC.addBook(req, res, next);

        done();
    });
});
