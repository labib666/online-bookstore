<template>
    <div id="admin">
        <AttemptAuth v-if="!isAuthSuccess"></AttemptAuth>
        <div v-if="isAuthSuccess">
            <Adminpanel></Adminpanel>
        </div>
    </div>
</template>

<script>
import AttemptAuth from '@/components/AttemptAuth';
import Adminpanel from '@/components/admin/Adminpanel';
import { mapState } from 'vuex';

export default {
    components: {
        AttemptAuth,
        Adminpanel
    },

    computed: {
        ...mapState([
            'isAuthSuccess'
        ])
    }
};
</script>
