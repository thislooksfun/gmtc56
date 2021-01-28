<template>
  <div class="hello">
    <h1>
      Hello {{ user.name }}
      <v-btn color="error" @click="logout">
        <v-icon left>mdi-logout</v-icon> Log Out
      </v-btn>
    </h1>
    <PhoneState ref="phone"></PhoneState>
    <Form @status="emitStatus"></Form>
  </div>
</template>

<script>
import { VBtn } from "vuetify/lib";
import Form from "@/components/Form.vue";
import PhoneState from "@/components/PhoneState.vue";

import * as api from "../api";

export default {
  name: "Main",
  components: {
    VBtn,
    Form,
    PhoneState,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
