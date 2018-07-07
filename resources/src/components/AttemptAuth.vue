<template>
    <div id="attempt-auth">
        Loading...
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
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
