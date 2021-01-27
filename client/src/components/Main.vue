<template>
  <div class="hello">
    <h1>Hello {{ user.name }}</h1>
    <div class="controls">
      <button v-if="inCall" @click="hangup">Hang up</button>
      <button v-else @click="next">Next caller</button>
    </div>
  </div>
</template>

<script>
import * as api from "../api";

export default {
  name: "Main",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inCall: false,
      message: null,
      msgTimeout: null,
    };
  },
  methods: {
    hangup() {
      api.hangup().then(() => (this.inCall = false));
    },
    next() {
      api
        .next()
        .then(() => (this.inCall = true))
        .catch(e => this.setMsg(e));
    },
    setMsg(msg, duration = 5000) {
      clearTimeout(this.msgTimeout);
      this.message = msg;

      if (duration > 0) {
        this.msgTimeout = setTimeout(() => {
          this.message = null;
        }, duration);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
