<template>
  <div class="home text-center">
    <h1>Sample Vue 3 Typescript Project</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <LinkGroup :LinkSets="linksets"></LinkGroup>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import LinkGroup, { LinkSet } from '@/components/LinkGroup.vue'

@Options({
  props: {
    msg: String
  },
  components: { LinkGroup },
  computed: {
    linksets() : LinkSet[] {
      return [
        {
          id: 1,
          title: "Installed CLI Plugins", 
          links: [
            { id: 1, href: "https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript", text: "typescript" }
          ]
        }, {
          id: 2,
          title: "Essential Links", 
          links: [
            { id: 2, href: "https://vuejs.org", text: "Core Docs" },
            { id: 3, href: "https://forum.vuejs.org", text: "Forum" },
            { id: 4, href: "https://chat.vuejs.org", text: "Community Chat" },
            { id: 5, href: "https://twitter.com/vuejs", text: "Twitter" },
            { id: 6, href: "https://news.vuejs.org", text: "News" }
          ]
        }, {
          id: 3,
          title: "Ecosystem", 
          links: [
            { id: 7, href: "https://router.vuejs.org", text: "vue-router" },
            { id: 8, href: "https://vuex.vuejs.org", text: "vuex" },
            { id: 9, href: "https://github.com/vuejs/vue-devtools#vue-devtools", text: "vue-devtools" },
            { id: 10, href: "https://vue-loader.vuejs.org", text: "vue-loader" },
            { id: 11, href: "https://github.com/vuejs/awesome-vue", text: "awesome-vue" }
          ]
        }
      ]
    }
  }
})
export default class HelloWorld extends Vue {}
</script>