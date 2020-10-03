<template>
  <div>
    {{ calling }}
    <div :class="calling ? 'container' : 'hide'" class="container">
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

      <div class="btnWrapper" v-if="calling">
        <!-- <div @click="makeCall">通話開始</div> -->
        <div class="btn" @click="closeCall">通話終了</div>
        <div class="btn" @click="shareScreenHandler">画面共有</div>
      </div>
    </div>
  </div>
</template>

<script>
// import Peer from "skyway-js";
// import { API_KEY } from "../../config/skyway";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      localStream: undefined,
      peer: {},
      peerID: "",
      mediaConnection: undefined,
      remoteOponent: {
        name: "",
        iconUrl: "",
      },
      calling: false,
    };
  },
  computed: {
    ...mapState(["callStart", "opponent", "user", "peerObj"]),
  },
  methods: {
    ...mapMutations(["changePeerId", "changeCallStatus"]),
    ...mapActions(["storeUser2Firebase"]),
    makeCall() {
      if (!this.peer.open) {
        return;
      }
      const remoteVideo = document.querySelector("#remoteVideo");
      //相手のremoteIDとか取得する
      //   this.peerID = document.getElementById("their-id").value;
      this.peerID = this.opponent.peerId;
      console.error(this.peerID);
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
        this._closeCallFlg();
      });
    },
    closeCall() {
      this.mediaConnection.close(true);
      this._closeCallFlg();
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
      shareScreenStream.getVideoTracks()[0].onended = () => {
        this.stopScreenShareProc();
      };
    },

    async stopScreenShareProc() {
      // 共有停止後の処理
      const localVideo = document.getElementById("localVideo");
      this.mediaConnection.replaceStream(this.localStream);
      localVideo.srcObject = this.localStream;
      await localVideo.play().catch(console.error);
    },
    hanleLocalMediaStreamError(error) {
      console.log("navigator.getUserMedia error: ", error);
    },
    _closeCallFlg() {
      this.calling = false;
      this.changeCallStatus(false);
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

    this.peer = this.peerObj;
    console.error(this.peer);

    // Register callee handler
    this.peer.on("call", (mediaConnection) => {
      this.mediaConnection = mediaConnection;
      if (mediaConnection.metadata && mediaConnection.metadata.payload) {
        this.remoteOponent.name = mediaConnection.metadata.payload.name;
        this.remoteOponent.iconUrl = mediaConnection.metadata.payload.iconUrl;
      }
      if (!this.callStart) {
        this.calling = true;
        this.$router.push({ name: "VideoChat" });
      }
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
        this._closeCallFlg();
      });
    });
    this.peer.on("error", console.error);

    if (this.callStart) {
      this.makeCall();
    }
  },
  beforeUnmount() {
    if (this.mediaConnection) {
      this.mediaConnection.close(true);
    }
    console.error("close");
    this._closeCallFlg();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.hide {
  display: none;
}

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
  background-color: rgb(240, 241, 241);
}

.btnWrapper {
  display: flex;
  justify-content: center;
  width: 800px;
}

.opponentContainer {
  display: flex;
  align-items: center;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.btn {
  margin: 10px;
  display: inline-block;
  width: 50px;
  padding: 5px 5px;
  background-color: rgb(240, 241, 241);
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
}
</style>
