<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="card-title">
                    <div class="clearfix">
                        <div class="float-left">
                            <h4>{{ title }}</h4>
                        </div>
                        <div v-if="user.isModerator" class="float-right">
                            <router-link :to="'/moderator/edit/book/' + id">
                                <button class="btn btn-primary">
                                    <b>Edit</b>
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-text">
                    Author: {{ author }}
                    <br />
                    <small>ISBN: {{ isbn }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: ['id', 'title', 'author', 'isbn'],

    computed: {
        ...mapState([
            'user'
        ])
    }
};
</script>
