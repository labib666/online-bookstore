<template>
    <div class="register">
        <div class="card">
            <div class="card-header">Register</div>
            <div class="card-body">
                <div class="form-group row">
                    <label for="name" class="col-md-4 col-form-label col-form-label-lg">Full name</label>
                    <div class="col-md-8">
                        <input id="name" class="form-control form-control-lg" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="username" class="col-md-4 col-form-label col-form-label-lg">Username</label>
                    <div class="col-md-8">
                        <input id="username" class="form-control form-control-lg" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="email" class="col-md-4 col-form-label col-form-label-lg">E-mail</label>
                    <div class="col-md-8">
                        <input id="email" class="form-control form-control-lg" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password" class="col-md-4 col-form-label col-form-label-lg">Password</label>
                    <div class="col-md-8">
                        <input type="password" id="password" class="form-control form-control-lg" />
                    </div>
                </div>

                <hr />
                <div class="float-left">
                    <a href="#" v-on:click="toggleLoginRegister">Already have an account?</a>
                </div>
                <div class="float-right">
                    <button type="submit" class="btn btn-primary mb-2">Register</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations([
            'toggleLoginRegister'
        ])
    }
};
</script>
