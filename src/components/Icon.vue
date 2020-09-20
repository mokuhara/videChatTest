<template>
  <div>
    <div class="icon">
      <img :src="imgSrc" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: String,
  },
};
</script>

<style lang="scss" scoped>
.icon img {
  width: 30px;
  height: 30px;
  padding: 5px;
  border-radius: 50%;
}
</style>