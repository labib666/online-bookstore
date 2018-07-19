import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Login from '@/views/Login';

describe('Login.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Login);
    });

    it('has Login button', () => {
        expect(wrapper.contains('button')).equal(true);
    });
});
