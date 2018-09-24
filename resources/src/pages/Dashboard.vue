<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Dashboard v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Dashboard from '@/views/Dashboard';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Dashboard
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
