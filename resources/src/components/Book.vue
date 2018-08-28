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
                    <small><span class="text-muted">by</span> {{ book.author }} &bull; <span class="text-muted">ISBN:</span> {{ book.isbn }}</small>
                    <hr />
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <div v-if="book.details">{{ summary }}</div>
                            <div v-if="!book.details">
                                <span class="text-muted">
                                    No description yet.
                                </span>
                            </div>
                        </div>
                        <div>
                            <div style="width: 100px;">
                                <div v-if="!book.image || book.image.length === 0">
                                    <i class="far fa-4x fa-file-image d-block" />
                                    <small class="text-muted">No image available</small>
                                </div>
                                <img v-if="book.image && book.image.length" :src="book.image" height="160px" width="100px" />
                            </div>
                        </div>
                    </div>
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
    props: [
        'book',
        'compact'
    ],

    components: {
        StarRatings
    },

    computed: {
        ...mapState([
            'user'
        ]),
        summary () {
            if (this.compact) return this.book.details.substr(0, 300) + (this.book.details.length > 300 ? ' ...' : '');
            return this.book.details;
        }
    },

    methods: {
        goToCategory (category) {
            this.$router.push(`/books/category/${category}`);
        }
    }
};
</script>
