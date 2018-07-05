import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loginOrRegisterChoice: true
    },
    mutations: {
        toggleLoginRegister (state) {
            state.loginOrRegisterChoice = !state.loginOrRegisterChoice;
        }
    },
    actions: {

    }
});
