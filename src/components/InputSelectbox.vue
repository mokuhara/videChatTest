<template>
  <div>
    <div class="container">
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
import { mapMutations, mapActions } from "vuex";

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
  methods: {
    ...mapActions(["storeUser2Firebase"]),
    ...mapMutations(["changeActiveStatus"]),
    submitData() {
      this.changeActiveStatus(this.selected);
      this.storeUser2Firebase();
    },
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
