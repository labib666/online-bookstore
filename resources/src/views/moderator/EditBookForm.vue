<template>
    <div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Book Title:</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="title" />
            </div>
        </div>

        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Author:</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="author" />
            </div>
        </div>

        <div class="form-group row">
            <label class="col-sm-2 col-form-label">ISBN:</label>
                <div class="col-sm-8">
                <input type="text" class="form-control" v-model="isbn" disabled />
            </div>
        </div>

        <button type="button" class="btn btn-primary" @click="save">Save</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            author: '',
            isbn: ''
        };
    },

    mounted () {
        const bookID = this.$route.params.id;
        this.$http.get(`/book/${bookID}`).then((response) => {
            const book = response.data.book;
            this.title = book.title;
            this.author = book.author;
            this.isbn = book.ISBN;
        });
    },

    methods: {
        save () {
            const bookID = this.$route.params.id;
            this.$http.patch(`/book/${bookID}`, {
                title: this.title,
                author: this.author
            }).then(res => {
                this.$notify({
                    text: 'Update sucessful'
                });
                this.$router.push(`/book/${bookID}`);
            }).catch(err => {
                this.$notify({
                    text: err.response.data.message,
                    type: 'error'
                });
            });
        }
    }
};
</script>
