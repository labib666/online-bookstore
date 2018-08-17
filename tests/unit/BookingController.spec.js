const chai = require('chai');
const sinon = require('sinon');
const mock = require('mock-require');
const createError = require('http-errors');

const Booking = require('../../app/models/Booking');
const BKC = require('../../app/controllers/BookingController');

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

describe('Test for BookingController:addBooking', function () {
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
                _id: 'abcd'
            },
            body: {
                quantity: '31'
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

    it('a valid booking', function (done) {
        sandbox.stub(Booking, 'create')
            .callsFake( function (booking) {
                return new Promise( function (resolve) {
                    booking._id = '1234';
                    resolve(booking);
                });
            });
        
        BKC.addBooking(req, { status: resStatusSpy }, nextSpy);
        
        setTimeout(function() {
            expect(nextSpy.callCount).to.equal(0);
            expect(resJsonSpy.callCount).to.equal(1);
            expect(resJsonSpy.args[0][0].booking).to.equal('1234');
            done();
        }, 250);
    });

    it('booking faces internal error', function (done) {
        sandbox.stub(Booking, 'create')
            .rejects(createError(500,'Internal'));
        
        BKC.addBooking(req, { status: resStatusSpy }, nextSpy);
            
        setTimeout(function() {
            expect(resJsonSpy.callCount).to.equal(0);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.args[0][0].status).to.equal(500);
            done();
        }, 250);
    });
});
