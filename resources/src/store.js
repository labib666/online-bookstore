import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loginOrRegisterChoice: true,
        isAuthAttempted: false,
        isAuthSuccess: false,
        user: null
    },
    mutations: {
        toggleLoginRegister (state) {
            state.loginOrRegisterChoice = !state.loginOrRegisterChoice;
        },
        authSuccess (store, user) {
            store.isAuthSuccess = true;
            store.user = user;
        },
        authAttempted (store) {
            store.isAuthAttempted = true;
        }
    },
    actions: {

    }
});
