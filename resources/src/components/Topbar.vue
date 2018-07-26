<template>
    <div id="topbar">
            <div class="left">
                <i class="material-icons" @click="toggleSidebar">menu</i>
                <router-link to="/" tag="a" class="brand">Online Bookstore</router-link>
            </div>
            <div class="right">
                <Logout></Logout>
            </div>
    </div>
</template>

<script>
import Logout from './Logout';
import { mapMutations } from 'vuex';
export default {
    components: {
        Logout
    },

    methods: {
        ...mapMutations([
            'toggleSidebar'
        ])
    }
};
</script>
