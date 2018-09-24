<template>
    <div class="user">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{{user.name}}</h5>
                <p class="card-text">E-mail: {{user.email}}</p>
                <div class="text-center">
                    <button v-if="!user.isModerator" @click="makeModerator" class="btn btn-primary">Make moderator</button>
                    <button v-if="user.isModerator" @click="removeModerator" class="btn btn-danger">Remove moderator</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    props: [
        'user'
    ],

    methods: {
        ...mapMutations([
            'updateUser'
        ]),

        makeModerator () {
            this.$http.patch(`/users/${this.user._id}`, {
                isModerator: true
            }).then((response) => {
                const updatedUser = {
                    ...this.user,
                    isModerator: true
                };
                this.updateUser(updatedUser);
            }).catch(() => {
                this.$notify({
                    text: 'Update failed!',
                    type: 'error'
                });
            });
        },

        removeModerator () {
            this.$http.patch(`/users/${this.user._id}`, {
                isModerator: false
            }).then((response) => {
                const updatedUser = {
                    ...this.user,
                    isModerator: false
                };
                this.updateUser(updatedUser);
            }).catch(() => {
                this.$notify({
                    text: 'Update failed!',
                    type: 'error'
                });
            });
        }
    }
};
</script>
