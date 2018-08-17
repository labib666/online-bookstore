<template>
    <span>
        <i v-for="i in full" :key="i" class="fas fa-star" @click="update(i)" />
        <i v-if="half" class="fas fa-star-half-alt" />
        <i v-for="i in empty" :key="i + full" class="far fa-star" @click="update(i+rating)" />
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

    computed: {
        full () {
            return Math.floor(this.rating);
        },

        empty () {
            return this.total - Math.ceil(this.rating);
        },

        half () {
            return this.total - this.full - this.empty;
        }
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
