<template>
  <div>
    <div @click="submit">
      <span class="btn">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    callback: Function,
    arg: String,
  },
  methods: {
    submit() {
      if (this.arg) {
        this.callback(this.arg);
      } else {
        this.callback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  padding: 5px 5px;
  background-color: rgb(43, 171, 159);
  color: #fff;
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
}
</style>
