import Vue from 'vue';
import VueAxios from 'vue-axios';
import Notifications from 'vue-notification';

import App from './App.vue';
import router from './router';
import store from './store';
import axios from './axios';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(Notifications);

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
