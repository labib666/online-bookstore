<template>
    <div class="row mr-0" style="margin-top:50px;">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Book Title:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" v-model="title" />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Image URL:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" v-model="image" />
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Details:</label>
                        <div class="col-sm-8">
                            <textarea class="form-control" v-model="details" />
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

                    <hr />
                    <button type="button" class="btn btn-primary float-right" @click="save">Save</button>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h3>Categories</h3>
                    <hr />
                    <div v-for="(category,idx) in categories" :key="category">
                        <li>{{ category }}  <i class="fas fa-times cross" @click="removeCategory(idx)" /> </li>
                    </div>
                    <div v-if="!categories.length">
                        <small>No categories</small>
                    </div>
                    <form @submit.prevent="saveNewCategory">
                        <div class="form-group row" style="margin-top:20px;">
                            <div class="col-md-8">
                                <input type="text" class="form-control" v-model="newCategory" />
                            </div>
                            <div class="col-md-4">
                                <button type="submit" class="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            id: '',
            title: '',
            image: '',
            author: '',
            details: '',
            isbn: '',
            categories: [],
            newCategory: ''
        };
    },

    mounted () {
        this.id = this.$route.params.id;
        this.$http.get(`/books/${this.id}`).then((response) => {
            const book = response.data.book;
            this.title = book.title;
            this.image = book.image;
            this.author = book.author;
            this.details = book.details;
            this.isbn = book.ISBN;
            this.categories = book.categories;
        });
    },

    methods: {
        save () {
            this.$http.patch(`/books/${this.id}`, {
                title: this.title,
                image: this.image,
                author: this.author,
                details: this.details
            }).then((res) => {
                this.$notify({
                    text: 'Update sucessful'
                });
                this.$router.push(`/books/${this.id}`);
            }).catch((err) => {
                this.$notify({
                    text: err.response.data.message,
                    type: 'error'
                });
            });
        },

        saveNewCategory () {
            const newCategory = this.newCategory;
            this.$http.post(`/books/${this.id}/category`, {
                category_name: newCategory
            }).then((res) => {
                this.categories.push(newCategory);
                this.newCategory = '';
            }).catch((err) => {
                this.$notify({
                    text: err.response.data.message,
                    type: 'error'
                });
            });
        },

        removeCategory (idx) {
            this.$http.delete(`/books/${this.id}/category`, {
                data: {
                    category_name: this.categories[idx]
                }
            }).then((res) => {
                this.categories.splice(idx, 1);
            }).catch((err) => {
                this.$notify({
                    text: err.response.data.message,
                    type: 'error'
                });
            });
        }
    }
};
</script>
