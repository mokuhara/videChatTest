<template>
  <div>
    {{ thread }}
    <textarea v-model="text"></textarea>
    <div class="submit" @click="sendMessage">送信</div>
    <div class="stop" @click="stopMessage">止める</div>
    {{ remoteOponent.name }}
    <p>=================</p>
    {{ opponent.peerId }}
  </div>
</template>

<script>
import Peer from "skyway-js";
import { API_KEY } from "../../config/skyway";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      text: "",
      thread: [],
      dataConnection: null,
      remoteOponent: {
        name: "",
        iconUrl: "",
      },
    };
  },
  computed: {
    ...mapState(["callStart", "opponent", "user"]),
  },
  methods: {
    ...mapMutations(["changePeerId", "changeCallStatus"]),
    ...mapActions(["storeUser2Firebase"]),
    sendMessage() {
      if (!this.user || !this.peer.open) return;
      this.peerID = this.opponent.peerId;
      const dataConnection =
        this.dataConnection ||
        this.peer.connect(this.peerID, {
          metadata: {
            payload: {
              name: this.user.name,
              iconUrl: this.user.iconUrl,
            },
          },
        });
      dataConnection.on("open", () => {
        const localMessage = {
          name: this.user.name,
          iconUrl: this.user.iconUrl,
          type: "local",
          text: this.text,
        };
        dataConnection.send({ text: this.text });
        this.thread.push(localMessage);
        this.text = "";
      });
    },
    stopMessage() {
      this.dataConnection.close();
    },
  },
  //   watch: {
  //     callStart(val) {
  //       if (val) {
  //         this.makeCall();
  //       }
  //     },
  //   },
  mounted() {
    this.peer = new Peer({
      key: API_KEY,
      debug: 3,
    });

    this.peer.once("open", (id) => {
      this.changePeerId(id);
      this.storeUser2Firebase();
    });

    // Register connected peer handler
    this.peer.on("connection", (_dataConnection) => {
      const dataConnection = this.dataConnection || _dataConnection;
      try {
        dataConnection.once("open", async () => {
          console.log("dataConnection.metadata.payload");
          console.log(dataConnection.metadata.payload);
          if (!dataConnection.metadata || !dataConnection.metadata.payload)
            throw new Error("remote user name is null");
          this.remoteOponent.name = dataConnection.metadata.payload.name;
          this.remoteOponent.iconUrl = dataConnection.metadata.payload.iconUrl;
        });
        dataConnection.on("data", (data) => {
          const remoteMessage = {
            name: this.remoteOponent.name,
            iconUrl: this.remoteOponent.iconUrl,
            type: "remote",
            text: data.text,
          };
          this.thread.push(remoteMessage);
        });
      } catch (e) {
        console.error(eval);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
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
