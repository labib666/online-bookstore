<template>
    <div>
        <button ref="glogin" class="btn btn-primary">Login with Google</button>
    </div>
</template>

<script>
export default {
    mounted () {
        const clientID = process.env.VUE_APP_GOOGLE_CLIENT_ID;
        const gapi = window.gapi;
        const params = {
            client_id: clientID
        };

        gapi.load('auth2', () => {
            const auth2 = gapi.auth2.init(params);
            auth2.attachClickHandler(this.$refs.glogin, {}, (googleUser) => {
                this.$http.post('/social/google', {
                    id_token: googleUser.getAuthResponse().id_token
                }).then((res) => {
                    window.localStorage.apitoken = res.data.token;
                    this.$notify({
                        text: 'Login Successful'
                    });
                    const path = this.$route.query.redirect || '/dashboard';
                    this.$router.push(path);
                }).catch(() => {
                    this.$notify({
                        text: 'Something went wrong :(',
                        type: 'error'
                    });
                });
            });
        });
    }
};
</script>
