<template>
    <div id="dashboard">
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            Dashboard area
        </div>
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }

};
</script>
