<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="Dashboard"></Sidebar>

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
