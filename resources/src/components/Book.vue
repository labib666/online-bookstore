<template>
    <div>
        <div class="card">
            <div class="card-body">
                <router-link :to="'/books/' + book.id" class="invisible-link">
                    <div class="card-title">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ book.title }}</h4>
                                <div v-if="book.rating">
                                    <span class="text-muted">
                                        <small>{{ book.rating.count }} users</small>
                                        &nbsp;
                                    </span>
                                    <StarRatings :rating="book.rating.rating" />
                                </div>
                                <span v-if="!book.rating" class="text-muted">
                                    <small>No ratings yet</small>
                                </span>
                            </div>
                            <div v-if="user.isModerator">
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
import StarRatings from '@/components/StarRatings';
export default {
    props: ['book'],

    components: {
        StarRatings
    },

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
