<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Books v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Books from '@/views/Books';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Books
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    },

    mounted () {
        document.title = 'All Books';
    }
};
</script>
