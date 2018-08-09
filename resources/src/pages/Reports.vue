<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Reports v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Reports from '@/views/admin/Reports';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Reports
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    },

    mounted () {
        document.title = 'Reports';
    }
};
</script>
