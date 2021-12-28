<template>
    <div class="flex justify-center">
        <button @click="doit" class="bg-green-800">click</button>
        <span class="px-4">{{clickCounter}}</span>
        <button @click="reset" class="bg-blue-800" :class="{'opacity-50':clickCounter == 0}" :disabled="clickCounter == 0">reset</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
</script>