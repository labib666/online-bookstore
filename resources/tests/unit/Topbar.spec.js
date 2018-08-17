import { expect } from 'chai';
import Topbar from '@/components/Topbar';
import { setup, cleanUp } from './setup';
import { type, checkAtNthLoop } from '../utils';
import sinon from 'sinon';

describe('Topbar.vue', () => {
    let wrapper, sandbox;

    beforeEach(() => {
        wrapper = setup(Topbar, {
            computed: {
                user () {
                    return {
                        name: 'Test User',
                        email: 'test@example.com'
                    };
                }
            }
        });
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        cleanUp();
        sandbox.restore();
    });

    it('has search box', () => {
        expect(wrapper.contains('input')).to.equal(true);
    });

    it('searching redirects to search page', (done) => {
        type(wrapper, '#searchInput', 'search query');
        wrapper.vm.searchBooks();
        checkAtNthLoop(() => {
            expect(wrapper.vm.$route.path).to.equal('/books/search/search query');
            done();
        });
    });
});
