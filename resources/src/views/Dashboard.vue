<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="Dashboard">
            <router-link to="/admin">Admin panel</router-link>
            <hr />
            <router-link to="/moderator">Moderator panel</router-link>
            <hr />
            <router-link to="/books">All books</router-link>
        </Sidebar>

    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';

export default {
    components: {
        Topbar,
        Sidebar
    },

    mounted () {
        document.title = 'Dashboard';
    }
};
</script>
