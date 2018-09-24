import { expect } from 'chai';
import Logout from '@/components/Logout';
import { setup, cleanUp } from './setup';
import { checkAtNthLoop, click } from '../utils';
import sinon from 'sinon';

describe('Login.vue', () => {
    let wrapper, sandbox;

    beforeEach(() => {
        wrapper = setup(Logout);
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        cleanUp();
        sandbox.restore();
    });

    it('logs out user', (done) => {
        let stub = sandbox.stub(wrapper.vm.$http, 'post').callsFake((path, data) => {
            expect(path).to.equal('/logout');
            return Promise.resolve();
        });

        window.localStorage.apitoken = 'abcd';
        click(wrapper, 'button');

        checkAtNthLoop(() => {
            sinon.assert.calledOnce(stub);
            expect(window.localStorage.apitoken).to.equal(undefined);
            expect(wrapper.vm.$route.path).to.equal('/');
            done();
        });
    });
});
