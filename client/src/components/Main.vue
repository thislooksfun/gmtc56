<template>
  <div class="hello">
    <h1>Hello {{ user.name }} <button @click="logout">Log Out</button></h1>
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
      ws: null,
    };
  },
  methods: {
    setStatus(status, color, duration = 5000) {
      this.$emit("status", { status, color, duration });
    },
    logout() {
      this.$emit("logout");
    },
    hangup() {
      api.hangup().then(() => (this.inCall = false));
    },
    next() {
      api
        .next()
        .then(() => (this.inCall = true))
        .catch(e => this.setStatus(e, "error"));
    },
    openSocket() {
      this.ws = api.openWebSocket();
      this.ws.onopen = () => this.setStatus("Connected", "success", 1500);
      this.ws.onmessage = e => console.log("Got message!", e.data);
      this.ws.onclose = () => {
        this.setStatus("Disconnected", "error", -1);
        this.ws = null;
      };
    },
  },
  created() {
    this.setStatus("Connecting...", "error", -1);
    this.openSocket();
  },
  destroyed() {
    if (this.ws) {
      this.ws.close();
    }
  },
};
</script>

<style lang="less" scoped></style>
