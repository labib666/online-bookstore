<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            <Admin></Admin>
        </div>
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
