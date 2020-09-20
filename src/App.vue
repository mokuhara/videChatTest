<template>
  <div>
    <div>
      <Auth />
    </div>
    <div>
      <MemberList />
    </div>
  </div>
</template>

<script>
import Auth from "./components/Auth.vue";
import MemberList from "./components/MemberList.vue";

import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Auth,
    MemberList,
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
</style>
