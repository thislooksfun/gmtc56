<template>
  <div class="hello">
    <h1>
      Hello {{ user.name }}
      <v-btn color="error" @click="logout">
        <v-icon left>mdi-logout</v-icon> Log Out
      </v-btn>
    </h1>
    <div class="controls">
      <v-btn v-if="inCall" color="error" @click="hangup">
        <v-icon left>mdi-phone-off</v-icon> Hang up
      </v-btn>
      <v-btn v-else color="primary" @click="next">
        <v-icon left>mdi-phone-in-talk</v-icon> Next caller
      </v-btn>
    </div>
    <Form></Form>
  </div>
</template>

<script>
import { VBtn } from "vuetify/lib";
import Form from "@/components/Form.vue";

import * as api from "../api";

export default {
  name: "Main",
  components: {
    VBtn,
    Form,
  },
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
    emitStatus(data) {
      this.$emit("status", data);
    },
    setStatus(status, color, duration = 5000) {
      this.emitStatus({ status, color, duration });
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
