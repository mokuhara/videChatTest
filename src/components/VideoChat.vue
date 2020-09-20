<template>
  <div>
    <div>
      <video id="my-video" autoplay muted playsinline></video>
      <p id="my-id"></p>
      <textarea id="their-id"></textarea>
      <div @click="makeCall">発疹</div>
      <video id="their-video" autoplay muted playsinline></video>
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
    };
  },
  methods: {
    ...mapMutations(["changePeerId"]),
    ...mapActions(["storeUser2Firebase"]),
    makeCall() {
      const theirID = document.getElementById("their-id").value;
      const mediaConnection = this.peer.call(theirID, this.localStream);
      this.setEventListener(mediaConnection);
    },
    setEventListener(mediaConnection) {
      mediaConnection.on("stream", (stream) => {
        // video要素にカメラ映像をセットして再生
        const videoElm = document.getElementById("their-video");
        videoElm.srcObject = stream;
        videoElm.play();
      });
    },
  },
  mounted() {
    this.peer = new Peer({
      key: API_KEY,
      debug: 3,
    });

    // カメラ映像取得
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // 成功時にvideo要素にカメラ映像をセットし、再生
        const videoElm = document.getElementById("my-video");
        videoElm.srcObject = stream;
        videoElm.play();
        // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
        this.localStream = stream;
      })
      .catch((error) => {
        // 失敗時にはエラーログを出力
        console.error("mediaDevice.getUserMedia() error:", error);
        return;
      });

    //PeerID取得
    this.peer.on("open", () => {
      document.getElementById("my-id").textContent = this.peer.id;
      this.changePeerId(this.peer.id);
      this.storeUser2Firebase();
    });

    //着信処理
    this.peer.on("call", (mediaConnection) => {
      const res = confirm("電話受けます？");
      if (res == true) {
        mediaConnection.answer(this.localStream);
        this.setEventListener(mediaConnection);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
#my-video {
  width: 200px;
  height: 200px;
}

#their-video {
  width: 400px;
  height: 400px;
}
</style>
