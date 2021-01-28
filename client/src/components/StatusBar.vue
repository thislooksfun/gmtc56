<template>
  <div :class="['status-bar', stateClass, ...colorClasses]">
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
    colorClasses() {
      const c = this.status ? this.status.color : "accent";
      return [c, "white--text"];
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
  font-size: 1.25em;
  height: 1.6em;
  line-height: 1.6em;

  &.hidden {
    display: none;
  }
}
</style>
