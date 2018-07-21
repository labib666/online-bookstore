<template>
    <div>
        <Topbar></Topbar>
        <div id="main">
            <Book :title="title" :author="author" :isbn="isbn"></Book>
        </div>
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import Book from '@/components/Book';

export default {
    components: {
        Topbar,
        Book
    },

    data () {
        return {
            title: '',
            author: '',
            isbn: ''
        };
    },

    mounted () {
        const bookPath = this.$route.path;
        this.$http.get(bookPath).then((response) => {
            const book = response.data.book;
            this.title = book.title;
            this.author = book.author;
            this.isbn = book.ISBN;
        });
    }
};
</script>
