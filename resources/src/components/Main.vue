<template>
    <div id="main" :class="{'toggle-full-width': isSidebarActive}">
        <slot></slot>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState([
            'isSidebarActive'
        ])
    }
};
</script>
