<template>
    <div>
        <div id="new-booking">
            <div class="card">
                <div class="card-header">
                    <div class="float-left">
                        Bookings
                    </div>
                    <div class="float-right">
                        <button class="btn btn-primary" @click="createBooking">New booking</button>
                    </div>
                </div>
                <div class="card-body pending-booking">
                    <div class="card-text">
                        <h1>Pending for reviews</h1>
                        <hr />
                        <div v-if="pending.length === 0">You haven't booked <b>{{ book.title }}</b> yet</div>
                        <div v-for="booking in pending" :key="booking.id">
                            <div class="row">
                                <div class="col-md-6">
                                    You requested for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }}
                                </div>
                                <div class="col-md-6">
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
                        <div v-for="booking in approved" :key="booking.id" class="clearfix">
                            <div class="float-left">
                                You request for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }} is approved
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>

                <div class="card-body cancelled-booking">
                    <div class="card-text">
                        <h1>Cancelled</h1>
                        <div v-for="booking in cancelled" :key="booking.id" class="clearfix">
                                You requested for {{ booking.quantity }} cop{{ booking.quantity > 1 ? 'ies' : 'y' }} has been cancelled
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
            this.$http.get(`/books/${this.book.id}/bookings/me`).then((response) => {
                const bookings = response.data.bookings.map((booking) => {
                    return {
                        id: booking._id,
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

        createBooking () {
            this.$http.post(`/books/${this.book.id}/bookings`, {
                quantity: 1
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
