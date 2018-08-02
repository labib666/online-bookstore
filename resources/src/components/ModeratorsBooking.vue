<template>
    <div>
        <div id="new-booking">
            <div class="card">
                <div class="card-body pending-booking">
                    <div class="card-text">
                        <h1>Pending for reviews</h1>
                        <hr />
                        <div v-if="pending.length === 0"> No pending requests</div>
                        <div v-for="booking in pending" :key="booking.id">
                            <div class="row">
                                <div class="col-md-4">
                                    {{ booking.user_id }} requested for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }}
                                </div>
                                <div class="col-md-8">
                                    <button class="btn btn-success" @click="approve(booking.id)">Approve</button>
                                    <button class="btn btn-danger" @click="cancel(booking.id)" >Cancel</button>
                                    <button class="btn btn-primary" @click="update(booking.id, booking.quantity + 1)">Add one</button>
                                    <button class="btn btn-primary" @click="update(booking.id, booking.quantity - 1)">Remove one</button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>

                <div class="card-body approved-booking">
                    <div class="card-text">
                        <h1>Approved</h1>
                        <hr />
                        <div v-for="booking in approved" :key="booking.id" class="clearfix">
                                {{ booking.user_id }} request for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }} is approved
                            <hr />
                        </div>
                    </div>
                </div>

                <div class="card-body cancelled-booking">
                    <div class="card-text">
                        <h1>Cancelled</h1>
                        <div v-for="booking in cancelled" :key="booking.id" class="clearfix">
                                {{ booking.user_id }} request for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }} has been cancelled
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['book'],

    data () {
        return {
            pending: [],
            cancelled: [],
            approved: []
        };
    },

    mounted () {
        this.fetchBookings();
    },

    methods: {
        fetchBookings () {
            this.$http.get(`/books/${this.book.id}/bookings`).then((response) => {
                const bookings = response.data.bookings.map((booking) => {
                    return {
                        id: booking._id,
                        user_id: booking.user_id,
                        quantity: booking.quantity,
                        status: booking.status
                    };
                });

                this.pending = bookings.filter((booking) => {
                    return booking.status === 'pending';
                });

                this.cancelled = bookings.filter((booking) => {
                    return booking.status === 'cancelled';
                });

                this.approved = bookings.filter((booking) => {
                    return booking.status === 'approved';
                });
            });
        },

        approve (bookingID) {
            this.$http.patch(`/books/bookings/${bookingID}`, {
                status: 'approved'
            }).then(() => {
                this.fetchBookings();
            });
        },

        update (bookingID, quantity) {
            this.$http.patch(`/books/bookings/${bookingID}`, {
                quantity
            }).then(() => {
                this.fetchBookings();
            });
        },

        cancel (bookingID) {
            this.$http.patch(`/books/bookings/${bookingID}`, {
                status: 'cancelled'
            }).then(() => {
                this.fetchBookings();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.btn {
    margin-right: 10px;
}
</style>
