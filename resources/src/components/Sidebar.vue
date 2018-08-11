<template>
    <div id="sidebar" :class="{'toggle-active': isSidebarActive}">
        <center>
            <h3 class="title">{{ title }}</h3>
            <hr />
        </center>
        <router-link tag="li" to="/dashboard">Dashboard</router-link>
        <hr />
        <router-link tag="li" to="/books">All books</router-link>
        <hr />
        <li @click="toggleCategoriesOpen">
            <div class="clearfix">
                <div class="float-left">
                    Categories
                </div>
                <div class="float-right">
                    <i v-if="!isCategoriesOpen" class="fas fa-plus" />
                    <i v-if="isCategoriesOpen" class="fas fa-minus" />
                </div>
            </div>
        </li>
        <div class="categories" :class="{active: isCategoriesOpen}">
            <div v-for="category in categories" :key="category">
                <router-link tag="li" :to="'/books/category/' + category">{{ category }}</router-link>
            </div>
        </div>
        <div v-if="user.isAdmin">
            <hr />
            <router-link tag="li" to="/admin">Admin panel</router-link>
        </div>
        <div v-if="user.isAdmin">
            <hr />
            <router-link tag="li" to="/reports">Sales Report</router-link>
        </div>
        <div v-if="user.isModerator">
            <hr />
            <router-link tag="li" to="/moderator">Moderator panel</router-link>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    props: ['title'],

    computed: {
        ...mapState([
            'user',
            'categories',
            'isSidebarActive',
            'isCategoriesOpen'
        ])
    },

    async mounted () {
        try {
            let response = await this.$http.get('/books/category/names');
            this.updateCategories(response.data.categories);
        } catch (err) {

        }
    },

    methods: {
        ...mapMutations([
            'toggleCategoriesOpen',
            'updateCategories'
        ])
    }
};
</script>
