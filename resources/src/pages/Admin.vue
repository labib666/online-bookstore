<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Admin v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Admin from '@/views/admin/Admin';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Admin
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
