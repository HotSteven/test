<template>
    <h1>WebSocket testing</h1>
    <div>
        <input type="text" v-model="msg" />
        <button @click="sendmessage" class="ml-4 bg-blue-800">Send</button>
        <p>{{socketdata}}</p>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    data() {
        return {
            socketdata: "",
            msg: "",
            ws: new WebSocket('ws://localhost:3000/')
        }
    },
    mounted() {
        // this.ws = new WebSocket('ws://localhost:3000/');
        this.ws.onmessage = (event:MessageEvent) => {
            console.log(event.data);
            this.socketdata = event.data;
        }
    },
    methods: {
        sendmessage() {
            this.ws.send(this.msg);
        }
    }
})
</script>