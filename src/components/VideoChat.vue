<template>
  <div>
    <div>
      <div class="videoContainer">
        <video id="remoteVideo" autoplay muted playsinline></video>
        <video id="localVideo" autoplay muted playsinline></video>
      </div>

      <div class="btn">
        <div @click="makeCall">通話開始</div>
        <div @click="closeCall">通話終了</div>
        <div @click="shareScreen">画面共有</div>
      </div>
    </div>
    <div>
      <p id="myId"></p>
      <textarea id="their-id"></textarea>
    </div>
  </div>
</template>

<script>
import Peer from "skyway-js";
import { API_KEY } from "../../config/skyway";
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      localStream: undefined,
      peer: {},
      peerID: "",
      mediaConnection: undefined,
      hoge: "",
    };
  },
  methods: {
    ...mapMutations(["changePeerId"]),
    ...mapActions(["storeUser2Firebase"]),
    makeCall() {
      if (!this.peer.open) {
        return;
      }
      const remoteVideo = document.querySelector("#remoteVideo");
      //相手のremoteIDとか取得する
      const theirID = document.getElementById("their-id").value;
      this.mediaConnection = this.peer.call(theirID, this.localStream);

      this.mediaConnection.on("stream", async (stream) => {
        // Render remote stream for caller
        remoteVideo.srcObject = stream;
        remoteVideo.playsInline = true;
        await remoteVideo.play().catch(console.error);
      });

      this.mediaConnection.once("close", () => {
        remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
        remoteVideo.srcObject = null;
      });
    },
    closeCall() {
      this.mediaConnection.close(true);
    },
    shareScreen() {
      const mediaStreamConstraints = {
        video: true,
      };
      navigator.mediaDevices
        .getDisplayMedia(mediaStreamConstraints)
        .then(this.gotLocalMediaStream)
        .catch(this.handleLocalMediaStreamError);
    },
    gotLocalMediaStream(mediaStream) {
      const localVideo = document.getElementById("localVideo");
      let requestFullScreen =
        localVideo.requestFullscreen ||
        localVideo.mozRequestFullScreen ||
        localVideo.webkitRequestFullScreen ||
        localVideo.msRequestFullscreen;
      requestFullScreen.call(localVideo);
      localVideo.srcObject = mediaStream;
      mediaStream.getVideoTracks()[0].onended = (evt) => {
        console.log(evt);
        this.stopScreenShareProc();
      };
      //   mediaStream.getTracks()
      //   .forEach(track.onended  => track.stop())
    },
    async stopScreenShareProc() {
      // 共有停止後の処理
      console.log("画面共有停止");
      // 元の画面に戻す処理
      const localVideo = document.getElementById("localVideo");
      const cancelFullScreen =
        localVideo.exitFullscreen ||
        localVideo.mozCancelFullScreen ||
        localVideo.webkitExitFullscreen ||
        localVideo.msExitFullscreen;
      cancelFullScreen.call(localVideo);

      localVideo.muted = true;
      localVideo.srcObject = this.localStream;
      localVideo.playsInline = true;
      await localVideo.play().catch(console.error);
    },
    hanleLocalMediaStreamError(error) {
      console.log("navigator.getUserMedia error: ", error);
    },
  },
  async mounted() {
    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.querySelector("#remoteVideo");

    //local video取得
    this.localStream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch(console.error);

    // Render local stream
    localVideo.muted = true;
    localVideo.srcObject = this.localStream;
    localVideo.playsInline = true;
    await localVideo.play().catch(console.error);

    this.peer = new Peer({
      key: API_KEY,
      debug: 3,
    });

    this.peer.once("open", (id) => {
      const target = document.querySelector("#myId");
      target.textContent = id;
      this.changePeerId(id);
      this.storeUser2Firebase();
      this.hoge = id;
    });

    // Register callee handler
    this.peer.on("call", (mediaConnection) => {
      mediaConnection.answer(this.localStream);

      mediaConnection.on("stream", async (stream) => {
        // Render remote stream for callee
        remoteVideo.srcObject = stream;
        remoteVideo.playsInline = true;
        await remoteVideo.play().catch(console.error);
      });

      mediaConnection.once("close", () => {
        remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
        remoteVideo.srcObject = null;
      });
    });
    this.peer.on("error", console.error);
  },
};
</script>

<style lang="scss" scoped>
.videoContainer {
  width: 800px;
  position: relative;
}

#localVideo {
  width: 240px;
  height: 135px;
  position: absolute;
  bottom: 30px;
  right: 30px;
}

#remoteVideo {
  width: 800px;
  height: 450px;
  background: red;
}

.btn {
  display: flex;
  justify-content: center;
}
</style>
