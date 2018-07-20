<template>
    <div id="moderator">
        <Topbar></Topbar>
        <div id="sidebar">
            <center><h3>Moderator panel</h3></center>
            <hr />
        </div>

        <div id="main">
            <BookForm></BookForm>
        </div>
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import BookForm from './BookForm';
import { mapState } from 'vuex';

export default {
    components: {
        Topbar,
        BookForm
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    mounted () {
        if (!this.user.isModerator) {
            this.$router.push('/');
        }
    }
};
</script>
