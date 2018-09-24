import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Moderator from './pages/Moderator';
import NewBookForm from './views/moderator/NewBookForm';
import EditBookForm from './views/moderator/EditBookForm';
import SearchBooks from './pages/SearchBooks';
import BooksByCategory from './pages/BooksByCategory';
import Books from './pages/Books';
import Book from './pages/Book';
import Privacy from './pages/Privacy';
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
            path: '/reports',
            component: Reports
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
                    path: 'edit/book/:id',
                    component: EditBookForm
                }
            ]
        },
        {
            path: '/books',
            component: Books
        },
        {
            path: '/books/search/:query',
            component: SearchBooks
        },
        {
            path: '/books/category/:category',
            component: BooksByCategory
        },
        {
            path: '/books/:id',
            name: 'book',
            component: Book
        },
        {
            path: '/privacy',
            component: Privacy
        },
        {
            path: '/*',
            name: 'NotFound',
            component: NotFound
        }
    ]
});
