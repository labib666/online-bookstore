<template>
    <div id="login">
        <form @submit.prevent="login">
            <div class="card">
                <div class="card-header">Login</div>
                <div class="card-body">
                    <div class="form-group row">
                        <label for="username" class="col-md-4 col-form-label col-form-label-lg">Username</label>
                        <div class="col-md-8">
                            <input id="username" v-model="username" class="form-control form-control-lg" />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="password" class="col-md-4 col-form-label col-form-label-lg">Password</label>
                        <div class="col-md-8">
                            <input type="password" v-model="password" id="password" class="form-control form-control-lg" />
                        </div>
                    </div>

                    <hr />
                    <div class="float-left">
                        <a href="#" v-on:click="toggleLoginRegister" class="uppercase">Create an account</a>
                    </div>
                    <div class="float-right">
                        <button type="submit" class="btn btn-primary mb-2">Login</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations } from 'vuex';

export default {
    data () {
        return {
            username: '',
            password: ''
        };
    },

    mounted () {
        document.title = 'Login';
    },

    methods: {
        ...mapMutations([
            'toggleLoginRegister'
        ]),
        login () {
            this.$http.post('/login', {
                username: this.username,
                password: this.password
            }).then((res) => {
                window.localStorage.apitoken = res.data.token;
                this.$notify({
                    text: 'Login Successful'
                });
                const path = this.$route.query.redirect || '/dashboard';
                this.$router.push(path);
            }).catch(() => {
                this.$notify({
                    text: 'Login failed',
                    type: 'error'
                });
            });
        }
    }
};
</script>
