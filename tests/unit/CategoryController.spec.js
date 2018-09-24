const chai = require('chai');
const sinon = require('sinon');
const mock = require('mock-require');

const Book = require('../../app/models/Book');
const Category = require('../../app/models/Category');
const CC = require('../../app/controllers/CategoryController');

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

describe('Test for CategoryController:addToCategory', function () {
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
                _id: 'abcd',
                isModerator: true
            },
            body: {
                category_name: 'test'
            },
            params: {
                id: 'wxyz'
            }
        };
        resJsonSpy = sandbox.spy();
        res = {
            json: resJsonSpy
        };
        resStatusSpy = sandbox.stub().returns(res);
        nextSpy =  sandbox.spy();
        sandbox.stub(Category, 'create')
            .callsFake( function (category) {
                return new Promise( function (resolve) {
                    category._id = '1234';
                    resolve(category);
                });
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

    it('a valid addition to the category', function (done) {
        sandbox.stub(Book, 'findOne')
            .resolves({_id: 'wxyz'});

        sandbox.stub(Category, 'findOne')
            .resolves(null);
        
        CC.addToCategory(req, { status: resStatusSpy }, nextSpy);
        
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(0);
            expect(resJsonSpy.callCount).to.equal(1);
            expect(resJsonSpy.args[0][0].book).to.equal('wxyz');
            done();
        }, 250);
    });

    it('book already exists in category', function (done) {
        sandbox.stub(Book, 'findOne')
            .resolves({_id: 'wxyz'});

        sandbox.stub(Category, 'findOne')
            .resolves({book_id: 'wxyz'});
        
        CC.addToCategory(req, { status: resStatusSpy }, nextSpy);
            
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(1);
            expect(resJsonSpy.callCount).to.equal(0);
            expect(nextSpy.args[0][0].status).to.equal(409);
            done();
        }, 250);
    });
});
