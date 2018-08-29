<template>
    <div>
        <Topbar></Topbar>
        <Sidebar title="Dashboard"></Sidebar>
        <Main>
            <div class="row mr-0">
                <div class="col-md-12">
                    <h3>Recommended for you</h3>
                    <h3 v-if="!recommended.length"><small>Browse and review some books to get suggestions</small></h3>
                </div>
            </div>
            <div class="row mr-0 mb-5">
                <div v-for="book in recommended" :key="book.id" class="col-lg-6 col-xl-4">
                    <Book :book="book" :compact="true" />
                </div>
            </div>
            <div class="row mr-0">
                <div class="col-md-5">
                    <h3>Your reviews</h3>
                    <h3 v-if="!reviews.length"><small>You haven't reviewed any book yet</small></h3>
                    <div v-for="review in reviews" :key="review.id" class="card">
                        <div class="card-body">
                            <div class="clearfix">
                                <div class="float-left">
                                    <router-link :to="'/books/' + review.book.id">{{ review.book.title }}</router-link>
                                </div>
                                <div class="float-right">
                                    <StarRatings :rating="review.rating" />
                                </div>
                            </div>
                            <p>{{review.review }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <UsersAllBookings v-if="!user.isModerator" />
                    <ModeratorsAllBookings v-if="user.isModerator" />
                </div>
            </div>
        </Main>
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Main from '@/components/Main';
import Book from '@/components/Book';
import StarRatings from '@/components/StarRatings';
import UsersAllBookings from '@/components/users/AllBookings';
import ModeratorsAllBookings from '@/components/moderators/AllBookings';
import { mapState } from 'vuex';

export default {
    components: {
        Topbar,
        Sidebar,
        Main,
        Book,
        StarRatings,
        UsersAllBookings,
        ModeratorsAllBookings
    },

    data () {
        return {
            recommended: [],
            reviews: [],
            pending: [],
            approved: [],
            cancelled: []
        };
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    mounted () {
        document.title = 'Dashboard';
        this.fetchRecommended();
        this.fetchReviews();
    },

    methods: {
        async fetchRecommended () {
            let recommended = await this.$http.get('/books/recommend');
            this.recommended = recommended.data.books.map((book) => {
                return {
                    ...book,
                    id: book._id,
                    isbn: book.ISBN
                };
            });
        },

        async fetchReviews () {
            let reviews = await this.$http.get('/users/me/ratings');

            let bookIDs = reviews.data.ratings.map((rating) => rating.book_id);
            bookIDs = bookIDs.map((id) => this.$http.get(`/books/${id}`));
            let bookMap = {};
            for (let book of bookIDs) {
                book = await book;
                book = book.data.book;
                bookMap[book._id] = book;
            }

            reviews.data.ratings.forEach((rating) => {
                this.reviews.push({
                    book: {
                        id: rating.book_id,
                        title: bookMap[rating.book_id].title
                    },
                    rating: rating.rating,
                    review: rating.review
                });
            });
        }
    }
};
</script>
