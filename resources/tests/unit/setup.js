import moxios from 'moxios';
import VueAxios from 'vue-axios';
import axios from 'axios';
import Notifications from 'vue-notification';
import Router from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';

export function setup (component) {
    moxios.install(axios);

    const router = new Router({});

    const localVue = createLocalVue();
    localVue.use(VueAxios, axios);
    localVue.use(Notifications);
    localVue.use(Router);

    window.localStorage = {};

    return mount(component, {
        localVue,
        router
    });
}

export function cleanUp () {
    moxios.uninstall(axios);
}
