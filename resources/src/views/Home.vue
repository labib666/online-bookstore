<template>
    <div class="home">
        <div class="flex-center full-height">
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
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

export default {
    name: 'home',
    components: {
        Login,
        Register
    },
    computed: {
        ...mapState([
            'loginOrRegisterChoice'
        ])
    }
};
</script>

<style lang="scss" scoped>
    .home {
        margin-top: -10vh;
    }
</style>
