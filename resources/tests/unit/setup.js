import VueAxios from 'vue-axios';
import axios from 'axios';
import Notifications from 'vue-notification';
import store from '@/store';
import Router from 'vue-router';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';

export function setup (component, config) {
    const router = new Router({});

    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueAxios, axios);
    localVue.use(Notifications);
    localVue.use(Router);

    window.localStorage = {};
    config = config || {};

    return mount(component, {
        localVue,
        router,
        store,
        ...config
    });
}

export function cleanUp () {
    // No-op
}
