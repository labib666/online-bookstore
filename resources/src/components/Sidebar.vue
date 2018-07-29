<template>
    <div id="sidebar" :class="{'toggle-active': isSidebarActive}">
        <center>
            <h3 class="title">{{ title }}</h3>
            <hr />
        </center>
        <slot></slot>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['title'],

    computed: {
        ...mapState([
            'isSidebarActive'
        ])
    }
};
</script>
