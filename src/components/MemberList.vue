<template>
  <div>
    <div>
      <div>
        メンバー一覧
      </div>
      <div class="membersContainer">
        <ul>
          <li v-for="(member, index) in members" :key="index">
            <div class="memberContainer" v-if="member.isLogin">
              <MemberCard
                :name="member.name"
                :isLogin="member.isLogin"
                :peerId="member.peerId"
                :iconUrl="member.iconUrl"
                :isActive="member.isActive"
                :uid="member.uid"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div>参考データ</div>
      {{ members }}
    </div>
  </div>
</template>

<script>
import MemberCard from "./MemberCard";

import { mapState } from "vuex";

export default {
  components: {
    MemberCard,
  },
  computed: {
    ...mapState(["members"]),
  },
};
</script>

<style lang="scss" scoped>
.membersContainer {
  margin: 0 auto;
  width: 400px;
}

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
</style>
