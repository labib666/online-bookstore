<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="Search results"></Sidebar>
        <Main>
            Search: {{ this.query }}
            <Loading v-if="loading" />
            <div v-if="!loading">
                <Books :books="books" />
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
import Books from '@/components/Books';

export default {
    components: {
        Main,
        Topbar,
        Sidebar,
        Loading,
        Books
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
