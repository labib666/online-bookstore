<template>
    <div>
        <Topbar />
        <Sidebar title="Sales report" />
        <Main>
            <div class="d-flex flex-wrap">
                <div>
                    <h1 style="padding:0px; margin-right:30px;">Reports</h1>
                </div>
                <div>
                    <form @submit.prevent="fetchReports">
                        <div class="form-row date-form" style="align-items:flex-end">
                            <div class="form-group col">
                                <label>Start date</label>
                                <input type="date" class="form-control date-picker" :data-date="startDate" v-model="startDate" />
                            </div>
                            <div class="form-group col">
                                <label>End date</label>
                                <input type="date" class="form-control date-picker" :data-date="endDate" v-model="endDate" />
                            </div>
                            <div class="form-group col">
                                <button class="btn btn-primary">Generate</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <hr />
            <p>Sales report between <b>{{ dStartDate }}</b> and <b>{{ dEndDate }}</b></p>
            <table class="table table-striped" style="padding-right: 0px;">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Categories</th>
                        <th scope="col">Sales</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(sale,i) in sales" :key="sale._id">
                        <th scope="row">{{ i+1 }}</th>
                        <td>{{ sale.title }}</td>
                        <td>
                            <li v-for="category in sale.categories" :key="category">
                                {{ category }}
                            </li>
                        </td>
                        <td>{{ sale.count }}</td>
                    </tr>
                </tbody>
            </table>
        </Main>
    </div>
</template>

<script>
import Main from '@/components/Main';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import StarRatings from '@/components/StarRatings';

export default {
    components: {
        Topbar,
        Sidebar,
        StarRatings,
        Main
    },

    data () {
        return {
            dStartDate: '',
            dEndDate: '',
            startDate: '',
            endDate: '',
            sales: []
        };
    },

    mounted () {
        let current = new Date();
        this.startDate = new Date(current.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.endDate = current;
        this.startDate = this.startDate.toISOString().slice(0, 10);
        this.endDate = this.endDate.toISOString().slice(0, 10);
        this.dStartDate = this.startDate;
        this.dEndDate = this.endDate;
        this.fetchReports();
    },

    methods: {
        async fetchReports () {
            try {
                let response = await this.$http.get('/books/report', {
                    params: {
                        startDate: this.startDate,
                        endDate: this.endDate
                    }
                });
                this.dStartDate = this.startDate;
                this.dEndDate = this.endDate;
                this.sales = response.data.books;
            } catch (err) {
                this.$notify({
                    text: err.response.data.message,
                    type: 'error'
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.date-form {
    * {
        margin: 0px;
    }
}

.date-picker {
    position: relative;;
    width: 260px;

    &::-webkit-datetime-edit, &::-webkit-inner-spin-button, &::-webkit-clear-button {
        display: none;
    }

    &::-webkit-calendar-picker-indicator {
        position: absolute;
        right: 3px;
        opacity: 1;
    }

    &::before {
        content: attr(data-date);
        display: inline-block;
    }
}
</style>
