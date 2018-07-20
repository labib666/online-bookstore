<template>
    <div id="admin">
        <Topbar></Topbar>
        <div id="sidebar">
            <center><h3>Admin panel</h3></center>
            <hr />
        </div>
        <div id="main">
            <h1>Moderators</h1>
            <div class="card-columns">
                <div v-for="user in users" v-if="user.isModerator" v-bind:key="user._id">
                    <User v-bind:user="user"></User>
                </div>
            </div>
            <hr />
            <h1>Registered users</h1>
            <div class="card-columns">
                <div v-for="user in users" v-if="!user.isModerator" v-bind:key="user._id">
                    <User v-bind:user="user"></User>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from './User';
import Topbar from '@/components/Topbar';
import { mapState, mapMutations } from 'vuex';
export default {
    components: {
        User,
        Topbar
    },

    computed: {
        ...mapState([
            'isAuthSuccess',
            'user',
            'users'
        ])
    },

    methods: {
        ...mapMutations([
            'updateUsers'
        ])
    },

    mounted () {
        if (!this.user.isAdmin) {
            this.$router.push('/');
            return;
        }

        this.$http.get('/user/group/all').then((response) => {
            let users = {};
            response.data.users.forEach((user) => {
                users[user._id] = user;
            });
            this.updateUsers(users);
        });
    }
};
</script>
