<template>
    <div class="home text-center">
        <h1 class="mb-4">This is the home page</h1>
        <p>This is a test page for the web-rtc protocol</p>
        <p>More information have be found at <a href="https://webrtc.org/">webrtc.org</a> and at <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API">developer.mozilla.org</a></p>
        <p>Code samples can be found on <a href="https://webrtc.github.io/samples/">github</a></p>
        <video :srcObject.prop="stream" autoplay class="m-4 mx-auto bg-black"></video>
        <button @click="start" :disabled="disable.start" class="m-4 bg-green-800" :class="{'opacity-50':disable.start}">start</button>
        <button @click="stop" :disabled="disable.stop" class="m-4 bg-red-800" :class="{'opacity-50':disable.stop}">stop</button>
        <p>{{errormessage}}</p>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import 'webrtc-adapter'

export default defineComponent({
    data() {
        return {
            stream: new MediaStream(),
            disable: {
                start: false,
                stop: true
            },
            errormessage: ""
        }
    },
    methods: {
        handleSuccess(stream:MediaStream) {
            console.log('Starting local stream', this.stream.getTracks());
            this.stream = stream; // make variable available to browser console
        },
        handleError(error:Error) {
            this.stop()
            if (error.name === 'OverconstrainedError') {
                // const v = this.constraints.video;
                // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
                this.errorMsg('The resolution is not supported by your device.');
            } else if (error.name === 'NotAllowedError') {
                this.errorMsg('Permissions have not been granted to use your camera and ' +
                    'microphone, you need to allow the page access to your devices in ' +
                    'order for the demo to work.');
            } else if (error.name === 'NotFoundError') {
                this.errorMsg('A usable media device was not found on your system');
            } else {
                this.errorMsg(`getUserMedia error: ${error.name}`, error);
            }
        },
        errorMsg(msg:string, error?:Error) {
            this.errormessage = msg;
            if (typeof error !== 'undefined') {
                console.error(error);
            }
        },
        async start() {
            this.disable.start = true;
            this.disable.stop = false;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasmic:boolean = devices.some(d => d.kind === 'audioinput');
            const hascam:boolean = devices.some(d => d.kind === 'videoinput');
            navigator.mediaDevices
                .getUserMedia({ audio: hasmic, video: hascam })
                .then(this.handleSuccess)
                .catch(this.handleError)
        },
        async stop() {
            console.log('Stopping local stream');
            this.disable.start = false;
            this.disable.stop = true;

            this.stream.getTracks().forEach(track => track.stop());
        }
    }
})
</script>