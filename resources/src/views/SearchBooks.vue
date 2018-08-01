<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="All books"></Sidebar>
        <Main>
            Search: {{ this.query }}
            <Loading v-if="loading" />
            <div v-if="!loading" class="row mr-0">
                <div v-for="book in books" :key="book.id" class="col-md-4">
                    <router-link :to="'/books/'+book.id" class="invisible-link">
                        <Book :book="book"></Book>
                    </router-link>
                </div>
            </div>
            <div v-if="!loading && books.length == 0" class="flex-center">
                <h1>No books found</h1>
            </div>
        </Main>
    </div>
</template>

<script>
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Loading from '@/components/Loading';
import Book from '@/components/Book';

export default {
    components: {
        Main,
        Topbar,
        Sidebar,
        Loading,
        Book
    },

    data () {
        return {
            loading: true,
            books: []
        };
    },

    computed: {
        query () {
            return this.$route.params.query;
        }
    },

    mounted () {
        this.fetchSearch();
    },

    watch: {
        // Watch the `query` props
        query () {
            this.fetchSearch();
        }
    },

    methods: {
        fetchSearch () {
            this.books = [];
            this.loading = true;
            const query = this.query;

            this.$http.post('/books/search', {
                search: query
            }).then((response) => {
                response.data.books.forEach((book) => {
                    const data = {
                        id: book._id,
                        author: book.author,
                        title: book.title,
                        isbn: book.ISBN,
                        categories: book.categories
                    };
                    this.books.push(data);
                });

                this.loading = false;
            });
        }
    }
};
</script>
