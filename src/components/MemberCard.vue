<template>
  <div>
    <div>
      {{ isActive }}
      <div class="memberContainer">
        <div class="leftContainer">
          <img class="icon" :src="iconUrl" />
          <div class="activeStatus" :class="isActive ? 'green' : 'red'"></div>
        </div>
        <div class="rightContainer">
          <p>{{ name }}</p>
        </div>
        <div v-if="isActive" class="callWrapper">
          <Button :text="text" :callback="callback" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button";

import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      text: "通話",
    };
  },
  methods: {
    ...mapActions(["getUser2Firebase"]),
    ...mapMutations(["changeCallStatus", "storeOpponent"]),
    callback() {
      const payload = {
        name: this.name,
        iconUrl: this.iconUrl,
        peerId: this.peerId,
      };
      this.getUser2Firebase();
      this.storeOpponent(payload);
      this.changeCallStatus(true);
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
};
</script>

<style lang="scss" scoped>
.memberContainer {
  display: flex;
}

.icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.leftContainer {
  position: relative;
}

.rightContainer {
  padding-left: 10px;
}

ul {
  list-style: none;
}

.activeStatus {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 35px;
  left: 35px;
}

.green {
  background: rgb(15, 196, 60);
}

.red {
  background: red;
}

.callWrapper {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
</style>
