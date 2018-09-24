<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <BooksByCategory v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import BooksByCategory from '@/views/BooksByCategory';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        BooksByCategory
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
