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
            'isAuthAttempted'
        ])
    },
    mounted () {
        setTimeout(() => {
            this.authAttempted();
        }, 1000);

        this.redirect();
    },

    methods: {
        ...mapMutations([
            'authSuccess',
            'authAttempted'
        ]),
        redirect () {
            if (this.$route.path === '/') return;
            this.$router.push('/?redirect=' + this.$route.path);
        }
    }
};
</script>
