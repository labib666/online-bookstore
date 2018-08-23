<template>
    <div id="topbar">
            <div class="left">
                <i class="fas fa-align-justify fa-lg" @click="toggleSidebar" />
                <router-link to="/" tag="a" class="brand">Online Bookstore</router-link>
            </div>
            <div class="right">
                <div class="mr-2">
                    <img :src="`https://www.gravatar.com/avatar/${emailHash}?s=40&d=${defaultURL}`" style="border-radius: 10%" />
                    {{ user.name }}
                </div>
                <form class="mr-2" @submit.prevent="searchBooks">
                    <input id="searchInput" type="text" class="form-control" placeholder="Search books" v-model="query" />
                </form>
                <Logout></Logout>
            </div>
    </div>
</template>

<script>
import Logout from './Logout';
import md5 from 'md5';
import { mapMutations, mapState } from 'vuex';
export default {
    data () {
        return {
            query: ''
        };
    },

    components: {
        Logout
    },

    computed: {
        ...mapState([
            'user'
        ]),

        emailHash () {
            return md5(this.user.email);
        },

        defaultURL () {
            return encodeURIComponent('https://api.adorable.io/avatars/40/' + this.user._id);
        }
    },

    methods: {
        ...mapMutations([
            'toggleSidebar'
        ]),

        searchBooks () {
            if (this.query.length === 0) return;
            //console.log('path is', `/books/search/${this.query}`);
            this.$router.push(`/books/search/${this.query}`);
            this.query = '';
        }
    }
};
</script>
