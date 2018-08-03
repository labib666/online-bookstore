<template>
    <div>
        <div class="card">
            <div class="card-body">
                <router-link :to="'/books/' + book.id" class="invisible-link">
                    <div class="card-title">
                        <div class="clearfix">
                            <div class="float-left">
                                <h4>{{ book.title }}</h4>
                            </div>
                            <div v-if="user.isModerator" class="float-right">
                                <router-link :to="'/moderator/edit/book/' + book.id">
                                    <i class="fas fa-edit fa-lg" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </router-link>
                <div class="card-text">
                    Author: {{ book.author }}
                    <br />
                    <small>ISBN: {{ book.isbn }}</small>
                    <hr />
                    <button v-for="category in book.categories" :key="category" class="btn btn-primary category" @click="goToCategory(category)">{{category}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: ['book'],

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        goToCategory (category) {
            this.$router.push(`/books/category/${category}`);
        }
    }
};
</script>
