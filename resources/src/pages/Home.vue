<template>
    <div>
        <div v-if="!isAuthAttempted">Loading...</div>
        <div v-if="isAuthAttempted" class="flex-center full-height home">
            <div class="flex-container">
                <h1 class="center-content">Online Bookstore</h1>
                <div class="col-md-12" v-if="!loginOrRegisterChoice">
                    <Register />
                </div>

                <div class="col-md-12" v-if="loginOrRegisterChoice">
                    <Login />
                </div>
                <div class="social-auth">
                    <center>
                        <social-auth />
                    </center>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapMutations } from 'vuex';
import Login from '@/views/Login';
import Register from '@/views/Register';
import SocialAuth from '@/components/SocialAuth';

export default {
    name: 'home',
    components: {
        Login,
        Register,
        SocialAuth
    },

    data () {
        return {
            isAuthAttempted: false
        };
    },

    computed: {
        ...mapState([
            'loginOrRegisterChoice',
            'isAuthSuccess'
        ])
    },

    methods: {
        ...mapMutations([
            'authSuccess'
        ])
    },

    mounted () {
        if (this.isAuthSuccess) {
            const path = this.$route.query.redirect || '/dashboard';
            this.$router.push(path);
            return;
        }

        if (!('apitoken' in window.localStorage)) {
            this.isAuthAttempted = true;
            return;
        }

        const apitoken = window.localStorage.apitoken;
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + apitoken;
        this.$http.get('/users/me').then((res) => {
            this.authSuccess(res.data.user);
            const path = this.$route.query.redirect || '/dashboard';
            this.$router.push(path);
        }).catch(() => {
            this.isAuthAttempted = true;
        });
    }
};
</script>
