<template>
    <div>
        <a ref="glogin" class="btn btn-primary">Login with Google</a>
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
                this.$http.post('/api/social/google', googleUser).then((response) => {
                    this.$notify({
                        text: 'Yay'
                    });
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
