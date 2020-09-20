<template>
  <div>
    <div>
      <ul>
        {{
          members
        }}
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["members"]),
  },
};
</script>

<style lang="scss" scoped></style>
