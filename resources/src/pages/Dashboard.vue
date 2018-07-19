<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            <Dashboard></Dashboard>
        </div>
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
