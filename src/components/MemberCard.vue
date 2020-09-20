<template>
  <div>
    <div>
      <div class="memberContainer">
        <div class="leftContainer">
          <img class="icon" :src="iconUrl" />
          <div class="activeStatus" :class="isActive ? 'green' : 'red'"></div>
        </div>
        <div class="rightContainer">
          <p>{{ name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
</style>
