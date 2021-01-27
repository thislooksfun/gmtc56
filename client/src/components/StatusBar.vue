<template>
  <div :class="['status-bar', stateClass]" :style="colors">
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    status: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stateClass() {
      return this.status ? ["shown"] : ["hidden"];
    },
    msg() {
      return this.status ? this.status.status : "- No Status -";
    },
    colors() {
      const c = this.status ? this.status.color : "other";
      switch (c) {
        case "success":
          return "background-color: #292; color: #fff";
        case "error":
          return "background-color: #822; color: #fff";
        case "other":
        default:
          // #838?
          return "background-color: #52f; color: #fff";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 1.6em;
  line-height: 1.6em;

  &.hidden {
    display: none;
  }
}
</style>
