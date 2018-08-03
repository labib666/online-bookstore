<template>
    <span>
        <i v-for="i in rating" :key="i" class="fas fa-star" @click="update(i)" />
        <i v-for="i in (total - rating)" :key="i + rating" class="far fa-star" @click="update(i+rating)" />
    </span>
</template>

<script>
export default {
    props: {
        rating: Number
    },

    data () {
        return {
            total: 5
        };
    },

    methods: {
        update (cnt) {
            this.$emit('update', cnt);
        }
    }
};
</script>

<style lang="scss" scoped>
i {
    color: orange;
    cursor: pointer;
    margin-right: 3px;
}
</style>
