<template>
    <div v-for="linkset in LinkSets" :key="linkset.id" class="mt-4">
        <h3>{{linkset.title}}</h3>
        <ul>
            <li v-for="link in linkset.links" :key="link.id" class="mx-2 inline-block"><a :href="link.href" target="_blank" rel="noopener">{{link.text}}</a></li>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export interface Link {
    id: number;
    href: string;
    text: string;
}
export interface LinkSet {
    id: number;
    title: string;
    links: Link[]
}
export default defineComponent({
    props: {
        LinkSets: Array as () => LinkSet[]
    }
})
</script>