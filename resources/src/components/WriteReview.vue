<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="card-text">
                    <div class="clearfix">
                        <div class="float-left">
                            <h2 style="display: inline-block">Your reviews</h2>
                        </div>
                        <div class="float-right">
                            <h2><StarRatings :rating="rating" @update="updateRating" /></h2>
                        </div>
                    </div>
                    <hr />
                    <div v-if="editMode">
                        <label>Write what you think about this book</label>
                        <textarea class="form-control" rows="5" v-model="review"></textarea>
                        <button class="btn btn-primary form-control" style="margin-top:15px;" @click="save">Save</button>
                    </div>
                    <div v-if="!editMode">
                        <p>{{ review }}</p>
                        <button v-if="synced" class="btn btn-primary form-control" style="margin-top:15px;" @click="makeEditable">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StarRatings from '@/components/StarRatings';
export default {
    props: [
        'book'
    ],

    components: {
        StarRatings
    },

    data () {
        return {
            rating: 0,
            review: '',
            editMode: false,
            synced: false
        };
    },

    async mounted () {
        try {
            let response = await new Promise((resolve, reject) => {
                resolve({
                    data: {
                        rating: 5,
                        review: 'Best book ever'
                    }
                });
            });

            this.rating = response.data.rating;
            this.review = response.data.review;
            this.synced = true;
        } catch (err) {
            // No operation
        }
    },

    methods: {
        save () {
            this.editMode = false;
            this.synced = true;
        },

        makeEditable () {
            this.editMode = true;
        },

        updateRating (cnt) {
            this.editMode = true;
            this.rating = cnt;
        }
    }

};
</script>
