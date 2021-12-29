<template>
    <h1>Axios test</h1>
    <div v-if="loading">
        loading activity
    </div>
    <div v-else>
        {{thingtodo}}
    </div>
    <button @click="getNewActivity" class="mt-4 bg-blue-600" :disabled="loading" :class="{'opactiy-50':loading}">Get New Activity</button>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
interface Activity {
    activity: string;
    type: string;
    participants: number;
    price: number;
    link: string;
    key: string;
    accessibility: number;
}
export default defineComponent({
    data() {
        return {
            loading: true,
            thingtodo: {
                activity: "",
                type: "",
                participants: 0,
                price: 0,
                link: "",
                key: "",
                accessibility: 0
            }
        }
    },
    created() {
        this.getNewActivity();
    },
    methods: {
        getNewActivity() {
            this.loading = true;
            this.$axios.get<Activity>(
                'https://www.boredapi.com/api/activity'
            ).then((response) => {
                this.thingtodo = response.data
                this.loading = false;
            }).catch((error) => {
                console.log(error);
            });
        }
    }
})
</script>