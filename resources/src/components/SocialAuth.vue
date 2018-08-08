<template>
    <div>
        <div class="glogin social" ref="glogin">
            <i class="fab fa-google" />
            <span>Continue with Google</span>
        </div>
        <div class="flogin social" @click="fblogin">
            <i class="fab fa-facebook"/>
            <span>Continue with Facebook</span>
        </div>
    </div>
</template>

<script>
export default {
    mounted () {
        // Google
        const gapi = window.gapi;
        const params = {
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
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

        // Facebook
        window.fbAsyncInit = () => {
            FB.init({
                appId: process.env.VUE_APP_FACEBOOK_APP_ID,
                autoLogAppEvents: false,
                xfbml: false,
                version: 'v3.1'
            });
        };

        (function (d, s, id) {
            if (d.getElementById(id)) {
                return;
            }
            let fjs = d.getElementsByTagName(s)[0];
            let js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    },

    methods: {
        fblogin () {
            FB.login(async (response) => {
                if (response.authResponse) {
                    this.$http.post('/social/facebook', {
                            id_token: response.authResponse.accessToken,
                            userID: response.authResponse.userID
                        })
                        .then( (response) => {
                            const data = response.data;
                            window.localStorage.apitoken = data.token;
                            this.$notify({
                                text: 'Login Successful'
                            });
                            const path = this.$route.query.redirect || '/dashboard';
                            this.$router.push(path);
                        })
                        .catch( (err) => {
                            this.$notify({
                                text: 'Login failed!',
                                type: 'error'
                            });
                        });
                } else {
                    this.$notify({
                        text: 'Login failed!',
                        type: 'error'
                    });
                }
            }, {
                scope: 'email',
                auth_type: 'rerequest'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.social {
    cursor: pointer;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
    padding-left: 10px;
    padding-right: 12px;
    margin-bottom: 5px;
    height: 40px;
    width: 240px;
}
.glogin {
    border-radius: 4px;
    background-color: #d34836;
}

.flogin {
    border-radius: 4px;
    background-color: #3b5998;
}
</style>
