<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="All books"></Sidebar>
        <Main>
            <Loading v-if="loading" />
            <div v-if="!loading" class="row mr-0">
                <div v-for="book in books" :key="book.id" class="col-md-4">
                    <router-link :to="'/books/'+book.id">
                        <Book :id="book.id" :title="book.title" :author="book.author" :isbn="book.isbn"></Book>
                    </router-link>
                </div>
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

    mounted () {
        this.$http.get('/books').then((response) => {
            response.data.books.forEach((book) => {
                const data = {
                    id: book._id,
                    author: book.author,
                    title: book.title,
                    isbn: book.ISBN
                };
                this.books.push(data);
            });

            this.loading = false;
        });
    }
};
</script>

<style lang="scss" scoped>
a, a:hover {
    color: inherit;
    text-decoration: inherit;
    font-weight: inherit;
}
</style>
