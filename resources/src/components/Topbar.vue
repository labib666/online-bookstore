<template>
    <div id="topbar">
        <div class="clearfix">
            <div class="float-left">
                <h4 class="brand">Online Bookstore</h4>
            </div>
            <div class="float-right">
                <Logout></Logout>
            </div>
        </div>
    </div>
</template>

<script>
import Logout from './Logout';
export default {
    components: {
        Logout
    }
};
</script>
