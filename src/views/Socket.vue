<template>
    <h1>WebSocket testing</h1>
    <div class="mt-4 flex">
        <input type="text" v-model="endpoint" class="w-full" />
        <button @click="connect" class="ml-2 bg-blue-800">Connect</button>
    </div>
    <div class="mt-4 flex">
        <input type="text" v-model="group" />
        <button @click="join" class="ml-2 bg-blue-800">Join</button>
        <input type="text" v-model="message" class="w-full ml-8" />
        <button @click="publish" class="ml-2 bg-blue-800">Send</button>
    </div>
    <div class="mt-4">
        <p v-for="(log, i) in logs" :key="i">{{log}}</p>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
interface SocketData {
    ws: WebSocket|null;
    endpoint: string;
    userId: string;
    connectionId: string;
    group: string;
    message: string;
    logs: string[];
    ackId: number;
    connected: boolean;
    connecting: boolean;
    groupjoined: boolean;

}
export default defineComponent({
    data(): SocketData {
        return {
            ws: null,
            endpoint: "",
            userId: "",
            connectionId: "",
            group: "",
            message: "",
            logs: [],
            ackId: 0,
            connected: false,
            connecting: false,
            groupjoined: false
        }
    },
    methods: {
        connect() {
            if (this.ws != null && this.ws.OPEN) this.ws.close();
            this.connecting = true;
            try {
                var markedEndpoint = this.endpoint;
                this.ws = new WebSocket(markedEndpoint, 'json.webpubsub.azure.v1');
                this.ws.onopen = () => {
                    this.logs.push(`${new Date().toISOString()} - Client WebSocket opened.`);
                };
                this.ws.onclose = (e:CloseEvent) => {
                    this.connected = false;
                    this.logs.push(`${new Date().toISOString()} - Client WebSocket closed. Type: ${e.type}, code: ${e.code}, reason: ${e.reason}, wasClean: ${e.wasClean}.`);
                };
                this.ws.onmessage = (e:MessageEvent) => {
                    // got a message
                    console.log('message', e);
                    let response = JSON.parse(e.data);
                    if (response.type === "system") {
                        if (response.event === "connected") {
                            this.userId = response.userId;
                            this.connectionId = response.connectionId;
                            this.connected = true;
                            this.logs.push(`${new Date().toISOString()} - ${response.userId || ''}:${response.connectionId} connected.`);
                        }
                        else if (response.event === "disconnected") {
                            this.connected = false
                            this.logs.push(`${new Date().toISOString()} - Disconnected. ${response.message}`);
                        }
                    }
                    else if (response.type === "ack") {
                        if (response.success) {
                            this.logs.push(`${new Date().toISOString()} - ack Success: ${response.ackId}`);
                        } else {
                            this.logs.push(`${new Date().toISOString()} - ack Error: ${response.error.message}`);
                        }
                    }
                    else if (response.type === "message") {
                        let content = response.data;
                        this.logs.push(`${new Date().toISOString()} - ${response.group}: ${content}`);
                    }
                }
            } catch (err) {
                this.logs.push(`${new Date().toISOString()} - Error: ${err}`);
            }
        },
        join() {
            if (this.ws == null) {
                this.logs.push(`${new Date().toISOString()} - Error: WebSocket object has not been declared`);
                throw 'WebSocket object has not been declared';
            }
            if (!this.connected) {
                this.logs.push(`${new Date().toISOString()} - Error: Not connected to server`);
                throw 'Not connected to server';
            }
            this.ws.send(
                JSON.stringify({
                    type: "joinGroup",
                    group: this.group,
                    ackId: this.ackId++ // ackId is optional, use ackId to make sure this action is executed
                }
            ));
            this.logs.push(`${new Date().toISOString()} - Joining group ${this.group}`);
            this.groupjoined = true;
        },
        publish() {
            if (this.ws == null) {
                this.logs.push(`${new Date().toISOString()} - Error: WebSocket object has not been declared`);
                throw 'WebSocket object has not been declared';
            }
            if (!this.connected) {
                this.logs.push(`${new Date().toISOString()} - Error: Not connected to server`);
                throw 'Not connected to server';
            }
            this.ws.send(
                JSON.stringify({
                    type: "sendToGroup",
                    group: this.group,
                    data: this.message,
                    ackId: this.ackId++ // ackId is optional, use ackId to make sure this action is executed
                }
            ));
            this.logs.push(`${new Date().toISOString()} - Sending message to group ${this.group}`);
        }
    }
})
</script>