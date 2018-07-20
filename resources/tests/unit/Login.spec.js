import expect from 'expect';
import Login from '@/views/Login';
import { setup, cleanUp } from './setup';
import moxios from 'moxios';

describe('Login.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup(Login);
    });

    afterEach(() => {
        cleanUp();
    });

    it('has Login button', () => {
        expect(wrapper.contains('button')).toBe(true);
    });

    it('accpets successful login', (done) => {
        moxios.stubRequest('/login', {
            status: 200,
            response: {
                token: 'abcd'
            }
        });

        wrapper.vm.login();

        moxios.wait(() => {
            expect(window.localStorage.apitoken).toBe('abcd');
            expect(wrapper.vm.$route.path).toBe('/dashboard');
            done();
        });
    });

    it('Fails on unsuccessful login attempt', (done) => {
        const currentPath = wrapper.vm.$route.path;
        moxios.stubRequest('/login', {
            status: 401
        });

        window.localStorage.apitoken = 'NoChange';
        wrapper.vm.login();

        moxios.wait(() => {
            expect(wrapper.vm.$route.path).toBe(currentPath);
            expect(window.localStorage.apitoken).toBe('NoChange');
            done();
        });
    });
});
