<template>
    <div id="admin">
        <Topbar></Topbar>
        <Sidebar title="Admin panel"></Sidebar>
        <Main>
            <h1>Moderators</h1>
            <div class="row mr-0">
                <div v-for="user in users" v-if="user.isModerator" v-bind:key="user._id" class="col-lg-4">
                    <User v-bind:user="user"></User>
                </div>
            </div>
            <hr />
            <h1>Registered users</h1>
            <div class="row mr-0">
                <div v-for="user in users" v-if="!user.isModerator" v-bind:key="user._id" class="col-lg-4">
                    <User v-bind:user="user"></User>
                </div>
            </div>
        </Main>
    </div>
</template>

<script>
import User from './User';
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import { mapState, mapMutations } from 'vuex';
export default {
    components: {
        Main,
        User,
        Topbar,
        Sidebar
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
        document.title = 'Admin panel';

        if (!this.user.isAdmin) {
            this.$router.push('/');
            return;
        }

        this.$http.get('/users').then((response) => {
            let users = {};
            response.data.users.forEach((user) => {
                users[user._id] = user;
            });
            this.updateUsers(users);
        });
    }
};
</script>
