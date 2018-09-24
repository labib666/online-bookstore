<template>
    <div class="row mr-0">
        <div v-for="book in books" :key="book.id" class="col-md-4">
            <Book :book="book" :compact="true"></Book>
        </div>
    </div>
</template>

<script>
import Book from '@/components/Book';

export default {
    components: {
        Book
    },

    props: ['books']
};
</script>
