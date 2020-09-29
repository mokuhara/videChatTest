<template>
  <div class="container">
    <div class="leftContainer">
      <div class="headerContainer">
        <InputSelectbox />
        <Auth />
      </div>
      <div>
        <MemberList />
      </div>
    </div>
    <div class="rightContainer"><router-view /></div>
  </div>
</template>

<script>
import Auth from "./components/Auth.vue";
import MemberList from "./components/MemberList.vue";
import InputSelectbox from "./components/InputSelectbox.vue";

import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Auth,
    MemberList,
    InputSelectbox,
  },
  methods: {
    ...mapActions(["getUser2Firebase"]),
  },
  mounted() {
    this.getUser2Firebase();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* .container {
  width: 600px;
} */

.container {
  display: flex;
}

.leftContainer {
  width: 30%;
}

.rightContainer {
  width: 70%;
}

.headerContainer {
  display: flex;
  justify-content: space-between;
}
</style>
