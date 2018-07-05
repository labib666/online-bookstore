<template>
    <div class="home">
        <div class="flex-center full-height">
            <div class="flex-container">
                <h1 class="m-b-md center-content">Online Bookstore</h1>
                <div class="row">
                    <div class="col-md-6">
                        <Login />
                    </div>

                    <div class="col-md-6">
                        <Login />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'

export default {
    name: 'home',
    components: {
        Login
    }
}
</script>

<style lang="scss" scoped>
    .home {
        margin-top: -10vh;
    }
</style>
