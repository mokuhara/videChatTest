<template>
  <div>
    <div class="container">
      <div>
        <ul>
          <li v-for="(message, index) in thread" :key="index">
            <Thread
              :name="message.name"
              :iconUrl="message.iconUrl"
              :type="message.type"
              :text="message.text"
              :createdAt="message.createdAt"
            />
          </li>
        </ul>
      </div>
      <div v-if="chatStart" class="submitChat">
        <textarea v-model="text"></textarea>
        <div class="submit" @click="sendMessage">送信</div>
        <!-- <div class="stop" @click="stopMessage">止める</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Thread from "./Thread";
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
      localId: null,
      remoteId: null,
    };
  },
  components: {
    Thread,
  },
  computed: {
    ...mapState(["callStart", "opponent", "user", "peerObj", "chatStart"]),
  },
  methods: {
    ...mapMutations(["changePeerId", "changeCallStatus", "changeChatStatus"]),
    ...mapActions(["storeUser2Firebase", "storeChat2DB"]),
    sendMessage() {
      if (!this.user || !this.peer.open) return;
      this.peerID = this.remoteId || this.opponent.peerId;
      this.dataConnection = this.peer.connect(this.peerID, {
        metadata: {
          payload: {
            name: this.user.name,
            iconUrl: this.user.iconUrl,
            remoteId: this.user.peerId,
          },
        },
      });
      this.dataConnection.on("open", () => {
        const localMessage = {
          name: this.user.name,
          iconUrl: this.user.iconUrl,
          type: "local",
          text: this.text,
          createdAt: new Date(),
        };
        this.dataConnection.send({ text: this.text || "切断されました" });
        this.thread.push(localMessage);
        this.text = "";
      });
    },
    stopMessage() {
      // const payload = {
      //   localUid: this.localId,
      //   remoteUid: this.remoteId,
      //   thread: this.thread,
      // };
      // this.storeChat2DB(payload);
      this.dataConnection.close(true);
      this.changeChatStatus(false);
    },
  },
  mounted() {
    this.localId = this.user.peerId;
    this.peer = this.peerObj;

    // Register connected peer handler
    this.peer.on("connection", (_dataConnection) => {
      this.dataConnection = _dataConnection;
      const name = this.dataConnection.metadata.payload.name;
      try {
        this.dataConnection.once("open", async () => {
          if (
            !this.dataConnection.metadata ||
            !this.dataConnection.metadata.payload
          )
            throw new Error("remote user name is null");
          this.remoteOponent.name = this.dataConnection.metadata.payload.name;
          this.remoteOponent.iconUrl = this.dataConnection.metadata.payload.iconUrl;
          this.remoteId = this.dataConnection.metadata.payload.remoteId;
          console.error(this.chatStart);
          if (!this.chatStart) {
            const comfirm = confirm(
              `${name}からチャット要請がきてます。受けますか？`
            );
            if (!comfirm) {
              this.sendMessage();
              this.dataConnection.close(true);
              return;
            }
          }
          //open chat window
          this.changeChatStatus(true);
        });
        this.dataConnection.on("data", (data) => {
          const remoteMessage = {
            name: this.remoteOponent.name,
            iconUrl: this.remoteOponent.iconUrl,
            type: "remote",
            text: data.text,
            createdAt: new Date(),
          };
          this.thread.push(remoteMessage);
        });
        this.dataConnection.on("close", () => {
          this.changeChatStatus(false);
        });
      } catch (e) {
        console.error(e);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  height: 900px;
  width: 100%;
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

.submitChat {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.submitChat textarea {
  flex: 9;
}

.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: #000;
  color: #fff;
}

ul {
  list-style: none;
  padding: 0;
}
</style>
