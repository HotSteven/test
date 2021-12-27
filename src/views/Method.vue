<template>
    <div class="home text-center">
        <h1>Method Testing</h1>
        <div class="mt-4 mx-auto w-60 flex">
            <button @click="doit" class="w-1/3 bg-green-800">click</button>
            <span class="w-1/3 px-4">{{clickCounter}}</span>
            <button v-if="clickCounter != 0" @click="reset" class="w-1/3 bg-red-800">reset</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
    data() {
        return {
            clickCounter: 0
        }
    },
    methods: {
        doit() {
            this.clickCounter++
        },
        reset() {
            this.clickCounter = 0;
        }
    }
})
export default class Method extends Vue {}
</script>