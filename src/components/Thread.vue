<template>
  <div class="root">
    <div class="container " v-if="type === 'remote'">
      <div class="remoteContainer">
        <div class="icon">
          <img :src="iconUrl" />
        </div>
        <div class="content">
          <div class="name">
            {{ name }}
          </div>
          <div class="text">
            {{ text }}
          </div>
        </div>
        <div class="timestamp">
          {{ formatDate }}
        </div>
      </div>
    </div>

    <div class="container " v-if="type === 'local'">
      <div class="localContainer">
        <div class="timestamp">
          {{ formatDate }}
        </div>
        <div class="content">
          <div class="text">
            {{ text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    iconUrl: String,
    type: String,
    text: String,
    createdAt: String,
  },
  computed: {
    formatDate() {
      const targetDate = new Date(this.createdAt);
      return `${("0" + (targetDate.getMonth() + 1)).slice(-2)}/${(
        "0" + targetDate.getDate()
      ).slice(-2)} ${("0" + targetDate.getHours()).slice(-2)}:${(
        "0" + targetDate.getMinutes()
      ).slice(-2)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  width: 600px;
}

.localContainer {
  margin-left: auto;
  display: flex;
}

.remoteContainer {
  margin-right: auto;
  display: flex;
}

.icon {
  height: 35px;
  margin-top: auto;
}

.icon img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  padding: 5px;
}

.content {
  max-width: 200px;
  word-wrap: break-word;
}

.localContainer .content {
  text-align: right;
}

.remoteContainer .content {
  text-align: left;
}

.name {
  font-size: 8px;
  color: rgba(0, 0, 0, 0.6);
  padding: 2px;
}

.text {
  padding: 5px;
  background-color: rgb(240, 241, 241);
  border-radius: 5px;
  font-size: 14px;
}

.timestamp {
  padding: 0 3px;
  margin-top: auto;
  font-size: 8px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
