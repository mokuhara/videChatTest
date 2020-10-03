<template>
  <div>
    <div>
      <div class="memberContainer">
        <div class="leftContainer">
          <div class="iconWrapper">
            <img class="icon" :src="iconUrl" />
            <div class="activeStatus" :class="isActive ? 'green' : 'red'"></div>
          </div>
        </div>
        <div class="rightContainer">
          <div>
            <p>{{ name }}</p>
          </div>
          <div v-if="isActive" class="chatWrapper">
            <div class="videoWrapper">
              <router-link to="/video">
                <Button :text="callText" :callback="startCall"
              /></router-link>
            </div>
            <div>
              <router-link to="/text"
                ><Button :text="chatText" :callback="startChat"
              /></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button";

import { mapMutations, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      callText: "通話",
      chatText: "チャット",
      peerId_: this.peerId,
    };
  },
  computed: {
    ...mapState(["user", "callStart", "peerObj"]),
  },
  methods: {
    ...mapActions(["getUser2Firebase", "getPeerIdFromDB"]),
    ...mapMutations(["changeCallStatus", "changeChatStatus", "storeOpponent"]),
    startCall() {
      const payload = {
        name: this.name,
        iconUrl: this.iconUrl,
        peerId: this.peerId_,
      };
      console.error("callpayload");
      console.error(payload);
      this.getUser2Firebase();
      //   this.getPeerIdFromDB(this.uid);
      //   this.getPeerIdFromDB(this.user.uid);
      this.storeOpponent(payload);
      this.changeCallStatus(true);
      console.error(this.callStart);
    },
    startChat() {
      this.getUser2Firebase();
      //   this.getPeerIdFromDB(this.uid);
      //   this.getPeerIdFromDB(this.user.uid);
      const payload = {
        name: this.name,
        iconUrl: this.iconUrl,
        peerId: this.peerId_,
      };
      console.error("text");
      console.error(payload);
      this.storeOpponent(payload);
      this.changeChatStatus(true);
    },
  },
  components: {
    Button,
  },
  props: {
    name: String,
    isLogin: Boolean,
    peerId: String,
    iconUrl: String,
    isActive: Boolean,
    uid: String,
  },
  watch: {
    peerId(val) {
      if (val) {
        this.peerId_ = val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.memberContainer {
  display: flex;
  height: 50px;
}

.icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.leftContainer {
  width: 150px;
}

.iconWrapper {
  width: 50px;
  padding-left: 20px;
  position: relative;
}

.rightContainer {
  display: flex;
  padding-left: 10px;
  align-items: center;
}

ul {
  list-style: none;
}

.activeStatus {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 38px;
  left: 58px;
}

.green {
  background: rgb(15, 196, 60);
}

.red {
  background: red;
}

.chatWrapper {
  display: flex;
  padding-left: 10px;
}

.videoWrapper {
  margin-right: 10px;
}
</style>
