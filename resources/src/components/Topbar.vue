<template>
    <div id="topbar">
            <div class="left">
                <i class="fas fa-align-justify fa-lg" @click="toggleSidebar" />
                <router-link to="/" tag="a" class="brand">Online Bookstore</router-link>
            </div>
            <div class="right">
                <input type="text" class="form-control search" placeholder="Search books" v-model="query" @keyup.enter="searchBooks" />
                <Logout></Logout>
            </div>
    </div>
</template>

<script>
import Logout from './Logout';
import { mapMutations } from 'vuex';
export default {
    data () {
        return {
            query: ''
        };
    },

    components: {
        Logout
    },

    methods: {
        ...mapMutations([
            'toggleSidebar'
        ]),

        searchBooks () {
            if (this.query.length === 0) return;
            this.$router.push(`/books/search/${this.query}`);
            this.query = '';
        }
    }
};
</script>

<style lang="scss" scoped>
.search {
    margin-right: 10px;
}
</style>
