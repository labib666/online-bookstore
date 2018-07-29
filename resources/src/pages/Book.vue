<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Book v-if="isAuthSuccess" />
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
