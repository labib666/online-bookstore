<template>
    <div id="logout">
        <button class="btn btn-danger" @click="logout">
            <i class="fas fa-sign-out-alt" />
        </button>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    methods: {
        ...mapMutations([
            'clearState'
        ]),

        logout () {
            this.$http.post('/logout').then(() => {
                this.$notify({
                    'text': 'Logout successful'
                });

                delete window.localStorage.apitoken;
                this.clearState();
                this.$router.push('/');
            }).catch(() => {
                this.$notify({
                    'text': 'Logout failed'
                });
            });
        }
    }
};
</script>
