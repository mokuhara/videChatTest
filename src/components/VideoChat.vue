<template>
  <div>
    <div>
      <div v-if="calling" class="opponentContainer">
        <div>
          <img class="icon" :src="opponent.iconUrl || remoteOponent.iconUrl" />
        </div>
        <p>{{ opponent.name || remoteOponent.name }}</p>
        <div></div>
      </div>
      <div class="videoContainer">
        <video id="remoteVideo" autoplay muted playsinline></video>
        <video id="localVideo" autoplay muted playsinline></video>
      </div>

      <div class="btn">
        <!-- <div @click="makeCall">通話開始</div> -->
        <div @click="closeCall">通話終了</div>
        <div @click="shareScreenHandler">画面共有</div>
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
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      localStream: undefined,
      peer: {},
      peerID: "",
      mediaConnection: undefined,
      hoge: "",
      remoteOponent: {
        name: "",
        iconUrl: "",
      },
      calling: false,
    };
  },
  computed: {
    ...mapState(["callStart", "opponent", "user"]),
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
      //   this.peerID = document.getElementById("their-id").value;
      this.peerID = this.opponent.peerId;
      this.mediaConnection = this.peer.call(this.peerID, this.localStream, {
        metadata: {
          payload: {
            name: this.user.name,
            iconUrl: this.user.iconUrl,
          },
        },
      });
      this.calling = true;

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
      this.calling = false;
    },
    async shareScreenHandler() {
      const shareScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      const combinedStream = new MediaStream([
        ...shareScreenStream.getTracks(),
        ...audioStream.getTracks(),
      ]);
      this.mediaConnection.replaceStream(combinedStream);
      const localVideo = document.getElementById("localVideo");
      localVideo.srcObject = shareScreenStream;
      await localVideo.play().catch(console.error);
      shareScreenStream.getVideoTracks()[0].onended = (evt) => {
        console.log(evt);
        this.stopScreenShareProc();
      };
    },

    async stopScreenShareProc() {
      // 共有停止後の処理
      console.log("画面共有停止");
      const localVideo = document.getElementById("localVideo");
      this.mediaConnection.replaceStream(this.localStream);
      localVideo.srcObject = this.localStream;
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
      if (mediaConnection.metadata && mediaConnection.metadata.payload) {
        this.remoteOponent.name = mediaConnection.metadata.payload.name;
        this.remoteOponent.iconUrl = mediaConnection.metadata.payload.iconUrl;
      }
      this.calling = true;
      mediaConnection.answer(this.localStream);
      this.mediaConnection = mediaConnection;
      mediaConnection.on("stream", async (stream) => {
        // Render remote stream for callee
        remoteVideo.srcObject = stream;
        remoteVideo.playsInline = true;
        await remoteVideo.play().catch(console.error);
      });

      mediaConnection.once("close", () => {
        remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
        remoteVideo.srcObject = null;
        this.calling = false;
      });
    });
    this.peer.on("error", console.error);
  },
  watch: {
    callStart(val) {
      console.log("watch", val);
      this.makeCall();
    },
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

.opponentContainer {
  display: flex;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
