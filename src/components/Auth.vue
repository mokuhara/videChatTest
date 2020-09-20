<template>
  <div>
    <div class="container">
      <div v-if="user.isLogin === false">
        <div class="btn" @click="_signIn">ログイン</div>
      </div>

      <div class="logout" v-if="user.isLogin === true">
        <div class="user">
          <Icon :imgSrc="user.iconUrl" />
        </div>
        <div class="btn" @click="_signOut">ログアウト</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Icon from "./Icon";

export default {
  components: {
    Icon,
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["signIn", "signOut", "checkLogin", "storeUser2Firebase"]),
    _signIn() {
      this.signIn();
    },
    _signOut() {
      this.signOut();
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 15px 0 5px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  width: 100px;
  padding: 5px;
  border-radius: 3px;
}

.btn:hover {
  background-color: rgb(246, 246, 244);
  cursor: pointer;
}

.logout {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
}

.userName {
  display: flex;
  align-items: center;
}
</style>
