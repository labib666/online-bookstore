<template>
    <div class="container-fluid">
        <h1>Add new book information</h1>
        <hr />
        <br />
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
                <input type="text" class="form-control" v-model="isbn"/>
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

    methods: {
        save () {
            this.$http.post('/books', {
                title: this.title,
                author: this.author,
                ISBN: this.isbn
            }).then(res => {
                const bookID = res.data.book;
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
