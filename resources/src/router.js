import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Moderator from './pages/Moderator';
import NewBookForm from './views/moderator/NewBookForm';
import EditBookForm from './views/moderator/EditBookForm';
import Book from './pages/Book';
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
            component: Moderator,
            children: [
                {
                    path: '',
                    component: NewBookForm
                },
                {
                    path: 'edit',
                    component: EditBookForm
                }
            ]
        },
        {
            path: '/moderator/book/:id',
            name: 'moderator-book-edit',
            component: EditBookForm
        },
        {
            path: '/book/*',
            name: 'book',
            component: Book
        },
        {
            path: '/*',
            name: 'NotFound',
            component: NotFound
        }
    ]
});
