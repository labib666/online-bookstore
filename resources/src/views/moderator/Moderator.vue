<template>
    <div id="moderator">
        <Topbar></Topbar>
        <Sidebar title="Moderator panel"></Sidebar>

        <Main>
            <router-view />
        </Main>
    </div>
</template>

<script>
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import { mapState } from 'vuex';

export default {
    components: {
        Main,
        Topbar,
        Sidebar
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    mounted () {
        if (!this.user.isModerator) {
            this.$router.push('/');
        }
    }
};
</script>
