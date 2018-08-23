const chai = require('chai');
const sinon = require('sinon');
const mock = require('mock-require');

const Book = require('../../app/models/Book');
const BC = require('../../app/controllers/BookController');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

mock('raccoon', {
    liked: function(a,b) {
        return new Promise(resolve => {
            resolve('liked '+a+' '+b);
        });
    },
    unliked: function(a,b) {
        return new Promise(resolve => {
            resolve('unliked '+a+' '+b);
        });
    },
    disliked: function(a,b) {
        return new Promise(resolve => {
            resolve('disliked '+a+' '+b);
        });
    },
    undisliked: function(a,b) {
        return new Promise(resolve => {
            resolve('undisliked '+a+' '+b);
        });
    }
});

describe('Test for BookController:addBook', function () {
    let req, res, resJsonSpy, resStatusSpy, nextSpy;

    // after all tests
    after( function(done) {
        mock.stopAll();
        done();
    });

    // before each test
    beforeEach( function (done) {
        req = {
            user: {
                isModerator: true
            },
            body: {
                title: 'test name',
                author: 'testname',
                ISBN: '0123456789',
                details: 'some details'
            }
        };
        resJsonSpy = sandbox.spy();
        res = {
            json: resJsonSpy
        };
        resStatusSpy = sandbox.stub().returns(res);
        sandbox.stub(BC,'getGoogleBookProfile').callsFake(() => {
            return new Promise(resolve => {
                resolve({
                    imageLinks: {
                        thumbnail: 'some url',
                    },
                    description: 'some more details'
                });
            });
        });
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
        
        BC.addBook(req, { status: resStatusSpy }, nextSpy);
        
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(0);
            expect(resJsonSpy.callCount).to.equal(1);
            expect(resJsonSpy.args[0][0].book).to.equal('1234');
            done();
        }, 250);
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
        
        BC.addBook(req, { status: resStatusSpy }, nextSpy);
            
        setTimeout(function() {
            expect(resJsonSpy.callCount).to.equal(0);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.args[0][0].status).to.equal(409);
            done();
        }, 250);
    });
});
