<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <SearchBooks v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import SearchBooks from '@/views/SearchBooks';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        SearchBooks
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
