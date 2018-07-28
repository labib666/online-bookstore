<template>
    <div>
        <Topbar></Topbar>
        <div id="sidebar"></div>
        <Main>
            <div class="row-container flex-center">
                <div class="col-md-6">
                    <div v-if="loading">
                        Loading...
                    </div>
                    <div v-if="book.loaded">
                        <Book :id="book.id" :title="book.title" :author="book.author" :isbn="book.isbn"></Book>
                    </div>
                    <div v-if="!loading && !book.loaded">
                        <h1>Book not found</h1>
                    </div>
                </div>
            </div>
        </Main>
    </div>
</template>

<script>
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import Book from '@/components/Book';

export default {
    components: {
        Main,
        Topbar,
        Book
    },

    data () {
        return {
            loading: true,
            book: {
                loaded: false,
                id: '',
                title: '',
                author: '',
                isbn: ''
            }
        };
    },

    mounted () {
        this.book.id = this.$route.params.id;
        this.$http.get(`/books/${this.book.id}`).then((response) => {
            const book = response.data.book;
            this.book.title = book.title;
            this.book.author = book.author;
            this.book.isbn = book.ISBN;

            this.loading = false;
            this.book.loaded = true;
        }).catch(() => {
            this.loading = false;
            this.book.loaded = false;
        });
    }
};
</script>
