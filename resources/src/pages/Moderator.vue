<template>
    <div>
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            <Moderator></Moderator>
        </div>
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
    }
};
</script>
