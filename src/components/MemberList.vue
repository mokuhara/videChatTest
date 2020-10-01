<template>
  <div>
    <div>
      <div>
        メンバー一覧
        {{ members }}
      </div>
      <div class="membersContainer">
        <ul>
          <li v-for="(member, index) in members" :key="index">
            <div
              class="memberContainer"
              v-if="member.isLogin && member.uid != user.uid"
            >
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
    ...mapState(["members", "user"]),
  },
};
</script>

<style lang="scss" scoped>
.membersContainer {
  margin: 0 auto;
}

ul {
  list-style: none;
  padding: 0;
}
</style>
