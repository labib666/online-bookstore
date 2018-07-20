import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Moderator from './pages/Moderator';
import NotFound from './pages/NotFound';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        },
        {
            path: '/moderator',
            name: 'moderator',
            component: Moderator
        },
        {
            path: '/*',
            name: 'NotFound',
            component: NotFound
        }
    ]
});
