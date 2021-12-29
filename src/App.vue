<template>
    <Menu></Menu>
    <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Menu from '@/components/Menu.vue'
export default defineComponent({ components: { Menu }})
</script>