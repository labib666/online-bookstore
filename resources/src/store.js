import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loginOrRegisterChoice: true,
        isAuthSuccess: false,
        user: null,
        users: {}
    },
    mutations: {
        toggleLoginRegister (state) {
            state.loginOrRegisterChoice = !state.loginOrRegisterChoice;
        },

        authSuccess (store, user) {
            store.isAuthSuccess = true;
            store.user = user;
        },

        // Call this mutation when you fetch users list
        updateUsers (store, users) {
            store.users = users;
        },

        updateUser (store, user) {
            store.users[user._id] = user;
        }
    },
    actions: {

    }
});
