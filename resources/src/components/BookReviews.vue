<template>
    <div style="margin-top: 30px;">
        <center>
            <h3>
                What others are thinking about <b>{{ book.title }}</b>
            </h3>
        </center>
        <div v-for="review in reviews" :key="review.id" class="card">
            <div class="card-body">
                <div class="card-text">
                    <div class="clearfix">
                        <div class="float-left">
                            <h2>{{ review.user.name }}</h2>
                        </div>
                        <div class="float-right">
                            <StarRatings :rating="review.rating" />
                        </div>
                    </div>
                    <p>{{ review.review }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StarRatings from '@/components/StarRatings';
export default {
    props: ['book'],

    components: {
        StarRatings
    },

    data () {
        return {
            reviews: []
        };
    },

    async mounted () {
        let ratings = await this.$http.get(`/books/${this.book.id}/ratings`);

        let userIDs = [];
        ratings.data.ratings.forEach((rating) => {
            userIDs.push(rating.user_id);
        });
        userIDs = [...new Set(userIDs)];
        let users = userIDs.map((id) => {
            return this.$http.get(`/users/${id}`);
        });
        let userMap = {};
        for (let user of users) {
            user = await user;
            user = user.data.user;
            userMap[user._id] = {
                id: user._id,
                name: user.name
            };
        }

        ratings.data.ratings.forEach((review) => {
            this.reviews.push({
                id: review._id,
                user: userMap[review.user_id],
                rating: review.rating,
                review: review.review
            });
        });
    }
};
</script>
