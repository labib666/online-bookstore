<template>
    <div>
        <Topbar></Topbar>
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
export default {
    components: {
        Topbar
    },

    mounted () {
        document.title = 'Dashboard';
    }
};
</script>
