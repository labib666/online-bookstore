<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="All books"></Sidebar>
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

    mounted () {
        this.$http.get('/books').then((response) => {
            response.data.books.forEach((book) => {
                const data = {
                    id: book._id,
                    author: book.author,
                    title: book.title,
                    isbn: book.ISBN,
                    categories: book.categories,
                    rating: book.rating,
                };
                this.books.push(data);
            });

            this.loading = false;
        });
    }
};
</script>
