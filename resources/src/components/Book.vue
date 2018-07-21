<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="card-title">
                    <h4>{{ title }}</h4>
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
export default {
    props: ['title', 'author', 'isbn']
};
</script>
