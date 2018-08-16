import { expect } from 'chai';
import Register from '@/views/Register';
import { setup, cleanUp } from './setup';
import { type, checkAtNthLoop } from '../utils';
import sinon from 'sinon';

describe('Register.vue', () => {
    let wrapper, sandbox;

    beforeEach(() => {
        wrapper = setup(Register);
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        cleanUp();
        sandbox.restore();
    });

    it('has register button', () => {
        expect(wrapper.contains('button')).to.equal(true);
    });

    it('requests to /register', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            expect(path).to.equal('/register');
            return Promise.resolve();
        });

        wrapper.vm.register();

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            done();
        });
    });

    it('sends the correct data', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            expect(data).to.deep.equal({
                username: 'user',
                password: '123456',
                email: 'test@example.com',
                name: 'Name'
            });

            return Promise.resolve();
        });

        type(wrapper, '#username', 'user');
        type(wrapper, '#password', '123456');
        type(wrapper, '#email', 'test@example.com');
        type(wrapper, '#name', 'Name');

        wrapper.vm.register();

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            done();
        });
    });
});
