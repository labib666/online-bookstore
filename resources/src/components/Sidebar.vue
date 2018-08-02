<template>
    <div id="sidebar" :class="{'toggle-active': isSidebarActive}">
        <center>
            <h3 class="title">{{ title }}</h3>
            <hr />
        </center>
        <router-link to="/dashboard">Dashboard</router-link>
        <hr />
        <router-link to="/books">All books</router-link>
        <div v-if="user.isAdmin">
            <hr />
            <router-link to="/admin">Admin panel</router-link>
        </div>
        <div v-if="user.isModerator">
            <hr />
            <router-link to="/moderator">Moderator panel</router-link>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['title'],

    computed: {
        ...mapState([
            'user',
            'isSidebarActive'
        ])
    }
};
</script>
