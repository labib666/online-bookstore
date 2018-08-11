import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const baseState = {
    isSidebarActive: false,
    loginOrRegisterChoice: true,
    isAuthSuccess: false,
    isCategoriesOpen: false,
    user: null,
    users: {},
    categories: []
};

export default new Vuex.Store({
    state: {
        ...baseState
    },
    mutations: {
        toggleSidebar (state) {
            state.isSidebarActive = !state.isSidebarActive;
        },

        toggleLoginRegister (state) {
            state.loginOrRegisterChoice = !state.loginOrRegisterChoice;
        },

        toggleCategoriesOpen (store) {
            store.isCategoriesOpen = !store.isCategoriesOpen;
        },

        setCategoriesOpen (store, val) {
            store.isCategoriesOpen = val;
        },

        authSuccess (store, user) {
            store.isAuthSuccess = true;
            store.user = user;
        },

        updateCategories (store, categories) {
            store.categories = categories;
        },

        // Call this mutation when you fetch users list
        updateUsers (store, users) {
            store.users = users;
        },

        updateUser (store, user) {
            store.users[user._id] = user;
        },

        clearState (store) {
            Object.keys(baseState).forEach((key) => {
                store[key] = baseState[key];
            });
        }
    },
    actions: {

    }
});
