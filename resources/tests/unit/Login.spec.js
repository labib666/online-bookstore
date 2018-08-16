import { expect } from 'chai';
import Login from '@/views/Login';
import { setup, cleanUp } from './setup';
import { type, checkAtNthLoop } from '../utils';
import sinon from 'sinon';

describe('Login.vue', () => {
    let wrapper, sandbox;

    beforeEach(() => {
        wrapper = setup(Login);
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        cleanUp();
        sandbox.restore();
    });

    it('has login button', () => {
        expect(wrapper.contains('button')).to.equal(true);
    });

    it('requests to /login', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            expect(path).to.equal('/login');
            return Promise.resolve();
        });

        wrapper.vm.login();
        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            done();
        });
    });

    it('sends the correct data', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            expect(data).to.deep.equal({
                username: 'user',
                password: '123456'
            });

            return Promise.resolve();
        });

        type(wrapper, '#username', 'user');
        type(wrapper, '#password', '123456');

        wrapper.vm.login();

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            done();
        });
    });

    it('saves apitoken and redirects after successful login', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            return Promise.resolve({
                data: {
                    token: 'abcd'
                }
            });
        });

        type(wrapper, '#username', 'user');
        type(wrapper, '#password', '123456');

        wrapper.vm.login();

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            expect(window.localStorage.apitoken).to.equal('abcd');
            expect(wrapper.vm.$route.path).to.equal('/dashboard');
            done();
        });
    });

    it('doesn\'t modify route or apitoken on unsuccessful login attempt', (done) => {
        const currentPath = wrapper.vm.$route.path;
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake(() => {
            return new Promise((resolve, reject) => {
                reject(new Error('Error'));
            });
        });

        window.localStorage.apitoken = 'NoChange';
        wrapper.vm.login();

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            expect(wrapper.vm.$route.path).to.equal(currentPath);
            expect(window.localStorage.apitoken).to.equal('NoChange');
            done();
        });
    });
});
