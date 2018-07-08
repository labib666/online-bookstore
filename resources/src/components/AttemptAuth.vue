<template>
    <div id="attempt-auth">
        Loading...
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
    computed: {
        ...mapState([
            'isAuthSuccess',
        ])
    },
    mounted () {
        if( ! ('apitoken' in window.localStorage) ) {
            this.redirectToLogin();
            return;
        }

        const apitoken = window.localStorage.apitoken;
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + apitoken;
        this.$http.get('/user')
            .then((res) => {
                this.authSuccess(res.data.user);
            })
            .catch((err) => {
                this.redirectToLogin();
            });
    },

    methods: {
        ...mapMutations([
            'authSuccess',
        ]),
        redirectToLogin () {
            if (this.$route.path === '/') return;
            this.$router.push('/?redirect=' + this.$route.path);
        }
    }
};
</script>
