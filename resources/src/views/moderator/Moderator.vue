<template>
    <div id="moderator">
        <Topbar></Topbar>
        <div id="sidebar">
            <center><h3>Moderator panel</h3></center>
            <hr />
            <router-link to="/moderator">Add new book</router-link>
        </div>

        <div id="main">
            <router-view />
        </div>
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import NewBookForm from './NewBookForm';
import { mapState } from 'vuex';

export default {
    components: {
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
