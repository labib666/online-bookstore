<template>
    <div>
        <Topbar></Topbar>
        <Sidebar :title="'Book category: ' + category"></Sidebar>
        <Main>
            <Loading v-if="loading" />
            <div v-if="!loading">
                <Books :books="books" />
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
import { mapMutations } from 'vuex';

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
        category () {
            return this.$route.params.category;
        }
    },

    watch: {
        // Watch the `category` props
        category () {
            this.fetch();
        }
    },

    mounted () {
        this.setCategoriesOpen(true);
        this.fetch();
    },

    methods: {
        ...mapMutations([
            'setCategoriesOpen'
        ]),

        fetch () {
            this.loading = true;
            this.$http.get(`/books/category/${this.category}`).then((response) => {
                this.books = [];
                response.data.books.forEach((book) => {
                    const data = {
                        id: book._id,
                        author: book.author,
                        title: book.title,
                        isbn: book.ISBN,
                        categories: book.categories,
                        rating: book.rating
                    };
                    this.books.push(data);
                });

                this.loading = false;
            }).catch(() => {
                this.$notify({
                    text: 'Something went wrong',
                    type: 'error'
                });
                this.loading = false;
            });
        }
    }
};
</script>
