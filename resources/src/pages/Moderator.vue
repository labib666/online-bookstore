<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess" />
        <Moderator v-if="isAuthSuccess" />
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Moderator from '@/views/moderator/Moderator';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Moderator
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    },

    mounted () {
        document.title = 'Moderator panel';
    }
};
</script>
