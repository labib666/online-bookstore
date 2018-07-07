<template>
    <div>
        <AttemptAuth v-if="!isAuthAttempted"></AttemptAuth>
        <div v-if="isAuthAttempted" class="flex-center full-height home">
            <div class="flex-container">
                <h1 class="m-b-md center-content">Online Bookstore</h1>
                    <div class="col-md-12" v-if="!loginOrRegisterChoice">
                        <Register />
                    </div>

                    <div class="col-md-12" v-if="loginOrRegisterChoice">
                        <Login />
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import AttemptAuth from '@/components/AttemptAuth';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

export default {
    name: 'home',
    components: {
        AttemptAuth,
        Login,
        Register
    },
    mounted () {
        if (this.isAuthSuccess) {
            this.$router.push('/dashboard');
        }
    },

    computed: {
        ...mapState([
            'loginOrRegisterChoice',
            'isAuthSuccess',
            'isAuthAttempted'
        ])
    }
};
</script>

<style lang="scss" scoped>
    .home {
        margin-top: -10vh;
    }
</style>
