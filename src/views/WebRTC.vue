<template>
    <div class="text-center">
        <h1 class="mb-4">WebRTC Testing</h1>
        <p>This is a test page for the web-rtc protocol</p>
        <p>More information have be found at <a href="https://webrtc.org/">webrtc.org</a> and at <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API">developer.mozilla.org</a></p>
        <p>Code samples can be found on <a href="https://webrtc.github.io/samples/">github</a></p>
        <div class= "flex justify-center">
            <video :srcObject.prop="localStream" autoplay class="m-4 mx-auto bg-black"></video>
            <video :srcObject.prop="remoteStream" autoplay class="m-4 mx-auto bg-black"></video>
        </div>
        <button @click="start" :disabled="disable.start" class="m-4 bg-blue-800" :class="{'opacity-50':disable.start}">start</button>
        <button @click="call" :disabled="disable.call" class="m-4 bg-green-800" :class="{'opacity-50':disable.call}">call</button>
        <button @click="hangup" :disabled="disable.hangup" class="m-4 bg-red-800" :class="{'opacity-50':disable.hangup}">hangup</button>
        <p>{{errormessage}}</p>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import 'webrtc-adapter'

export default defineComponent({
    data() {
        return {
            localStream: new MediaStream(),
            remoteStream: new MediaStream(),
            pc1: new RTCPeerConnection(),
            pc2: new RTCPeerConnection(),
            disable: {
                start: false,
                call: true,
                hangup: true
            },
            errormessage: ""
        }
    },
    methods: {
        async start() {
            console.log('starting local stream');
            this.disable.start = true;
            this.disable.hangup = true;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasmic:boolean = devices.some(d => d.kind == 'audioinput');
            const hascam:boolean = devices.some(d => d.kind == 'videoinput');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: hasmic, video: hascam });
                this.localStream = stream;
                this.disable.call = false;
            } catch (error) {
                this.disable.start = false;
                this.disable.call = true;
                this.errormessage = 'failed to start';
                console.log(error);
            }
        },
        async call() {
            this.disable.start = true;
            this.disable.call = true;
            this.disable.hangup = false;
            console.log('starting', window.performance.now());
            const videoTracks = this.localStream.getVideoTracks();
            const audioTracks = this.localStream.getAudioTracks();
            if (videoTracks.length > 0) {
                console.log(`Using video device: ${videoTracks[0].label}`);
            }
            if (audioTracks.length > 0) {
                console.log(`Using audio device: ${audioTracks[0].label}`);
            }
            const configuration = {};
            console.log('RTCPeerConnection configuration:', configuration);
            let pc1 = new RTCPeerConnection(configuration);
            this.pc1 = pc1;
            console.log('Created local peer connection object pc1');
            pc1.addEventListener('icecandidate', e => this.onIceCandidate(pc1, e));
            pc1.addEventListener('iceconnectionstatechange', e => this.onIceStateChange(pc1, e));
            let pc2 = new RTCPeerConnection(configuration);
            this.pc2 = pc2;
            console.log('Created remote peer connection object pc2');
            pc2.addEventListener('icecandidate', e => this.onIceCandidate(pc2, e));
            pc2.addEventListener('iceconnectionstatechange', e => this.onIceStateChange(pc2, e));
            pc2.addEventListener('track', this.onGetRemoteStream);

            // add data to the local stream
            this.localStream.getTracks().forEach(track => pc1.addTrack(track, this.localStream));

            try {
                console.log('pc1 createOffer start');
                const offer = await pc1.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await this.createOfferSuccess(pc1, pc2, new RTCSessionDescription(offer));
            } catch (error) {
                // onCreateSessionDescriptionError(e);
                console.log(`Failed to create session description: ${error}`);
            }
        },
        async createOfferSuccess(pc1:RTCPeerConnection, pc2:RTCPeerConnection, desc:RTCSessionDescription) {
            console.log(`Offer from pc1\n${desc.sdp}`);
            console.log('pc1 setLocalDescription start');
            try {
                await pc1.setLocalDescription(desc);
                // onSetLocalSuccess(pc1);
                console.log(`${this.getName(pc1)} setLocalDescription complete`);
            } catch (error) {
                // onSetSessionDescriptionError();
                console.log(`Failed to set session description: ${error}`);
            }

            console.log('pc2 setRemoteDescription start');
            try {
                await pc2.setRemoteDescription(desc);
                // onSetRemoteSuccess(pc2);
                console.log(`${this.getName(pc2)} setRemoteDescription complete`);
            } catch (error) {
                // onSetSessionDescriptionError();
                console.log(`Failed to set session description: ${error}`);
            }

            console.log('pc2 createAnswer start');
            // Since the 'remote' side has no media stream we need
            // to pass in the right constraints in order for it to
            // accept the incoming offer of audio and video.
            try {
                const answer = await pc2.createAnswer();
                await this.createAnswerSuccess(pc1, pc2, new RTCSessionDescription(answer));
            } catch (error) {
                // onCreateSessionDescriptionError(e);
                console.log(`Failed to create session description: ${error}`);
            }
        },
        async createAnswerSuccess(pc1:RTCPeerConnection, pc2:RTCPeerConnection, desc:RTCSessionDescription) {
            console.log(`Answer from pc2:\n${desc.sdp}`);
            console.log('pc2 setLocalDescription start');
            try {
                await pc2.setLocalDescription(desc);
                // onSetLocalSuccess(pc2);
                console.log(`${this.getName(pc2)} setLocalDescription complete`);
            } catch (error) {
                // onSetSessionDescriptionError(e);
                console.log(`Failed to set session description: ${error}`);
            }
            console.log('pc1 setRemoteDescription start');
            try {
                await pc1.setRemoteDescription(desc);
                // onSetRemoteSuccess(pc1);
                console.log(`${this.getName(pc1)} setRemoteDescription complete`);
            } catch (error) {
                // onSetSessionDescriptionError(e);
                console.log(`Failed to set session description: ${error}`);
            }
        },
        async onIceCandidate(pc:RTCPeerConnection, event:RTCPeerConnectionIceEvent) {
            try {
                if (event.candidate == null)
                    throw 'candidate is null'
                await this.getOtherPc(pc).addIceCandidate(event.candidate.toJSON());
                // onAddIceCandidateSuccess(pc);
                console.log(`${this.getName(pc)} addIceCandidate success`);
            } catch (error) {
                // onAddIceCandidateError(pc, e);
                console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error}`);
            }
            console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
        },
        onIceStateChange(pc:RTCPeerConnection, event:Event) {
            if (pc) {
                console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
                console.log('ICE state change event: ', event);
            }
        },
        onGetRemoteStream(event:RTCTrackEvent) {
            if (this.remoteStream !== event.streams[0]) {
                this.remoteStream = event.streams[0];
                console.log('pc2 received remote stream');
            }
        },
        getName(pc:RTCPeerConnection) {
            return (pc === this.pc1) ? 'pc1' : 'pc2';
        },
        getOtherPc(pc:RTCPeerConnection) {
            return (pc === this.pc1) ? this.pc2 : this.pc1;
        },
        async hangup() {
            console.log('Ending call');
            this.pc1.close();
            this.pc2.close();
            this.pc1 = new RTCPeerConnection();
            this.pc2 = new RTCPeerConnection();
            this.disable.start = false;
            this.disable.call = true;
            this.disable.hangup = true;
            this.localStream.getTracks().forEach(track => track.stop());
            this.remoteStream.getTracks().forEach(track => track.stop());
        }
    }
})
</script>