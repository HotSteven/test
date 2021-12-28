<template>
    <div class="home text-center">
        <h1>Method Testing</h1>
        <h3 class="mt-8">Click Counter</h3>
        <ClickCounter class="mt-4"></ClickCounter>
        <h3 class="mt-8">Timer</h3>
        <Timer class="mt-4"></Timer>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ClickCounter from '@/components/ClickCounter.vue';
import Timer from '@/components/Timer.vue';
export default defineComponent({
    components: { Timer, ClickCounter }
})
</script>