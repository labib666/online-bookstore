<template>
    <div id="moderator">
        <Topbar></Topbar>
        <div id="sidebar">
            <center><h3>Moderator panel</h3></center>
            <hr />
            <router-link to="/moderator">Add new book</router-link>
        </div>

        <Main>
            <router-view />
        </Main>
    </div>
</template>

<script>
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import NewBookForm from './NewBookForm';
import { mapState } from 'vuex';

export default {
    components: {
        Main,
        Topbar,
        NewBookForm
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
