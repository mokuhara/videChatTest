<template>
  <div>
    <div class="container" v-if="user.uid">
      <div class="title">
        受電可否
      </div>
      <div>
        <select v-model="selected" @change="submitData">
          <option v-for="option in options" :value="option.value" :key="option">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import Peer from "skyway-js";
import { API_KEY } from "../../config/skyway";

export default {
  data() {
    return {
      selected: true,
      options: [
        { text: "OK", value: true },
        { text: "NG", value: false },
      ],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["storeUser2Firebase"]),
    ...mapMutations(["changeActiveStatus", "changePeerId", "changePeerObj"]),
    submitData() {
      if (this.selected) {
        const peer = new Peer({
          key: API_KEY,
          debug: 3,
        });
        this.changePeerObj(peer);

        peer.once("open", (id) => {
          this.changePeerId(id);
        });
      } else {
        this.changePeerId("");
      }
      this.changeActiveStatus(this.selected);
      this.storeUser2Firebase();
    },
  },
  mounted() {
    if (this.selected) {
      const peer = new Peer({
        key: API_KEY,
        debug: 3,
      });
      this.changePeerObj(peer);

      peer.once("open", (id) => {
        this.changePeerId(id);
        this.changeActiveStatus(this.selected);
        this.storeUser2Firebase();
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  padding: 5px;
}

.title {
  padding-right: 10px;
}
</style>
