<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            <Book></Book>
        </div>
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Book from '@/views/Book';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Book
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
