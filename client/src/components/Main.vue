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
    <TMLog :messages="tmLog"></TMLog>
  </div>
</template>

<script>
import { VBtn } from "vuetify/lib";
import Form from "@/components/Form.vue";
import PhoneState from "@/components/PhoneState.vue";
import TMLog from "@/components/TMLog.vue";

import * as api from "../api";

export default {
  name: "Main",
  components: {
    VBtn,
    Form,
    PhoneState,
    TMLog,
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
      authorized: false,
      allowReopen: true,
      tmLog: [],
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
      if (!this.allowReopen) return;

      this.setStatus("Connecting...", "error", -1);
      this.ws = api.openWebSocket();
      if (!this.ws) {
        this.setStatus("Disconnected", "error", -1);
        setTimeout(() => this.openSocket(), 5000);
        return;
      }

      this.ws.onopen = () => {
        this.setStatus("Connected", "success", 1500);
        api.info();
      };
      this.ws.onmessage = e => {
        try {
          this.processSocketMessage(e.data);
        } catch (e) {
          console.log("Unable to process websocket message", e.data);
        }
      };
      this.ws.onclose = () => {
        this.ws = null;
        this.setStatus("Disconnected", "error", -1);
        setTimeout(() => this.openSocket(), 5000);
      };
    },
    processSocketMessage(sm) {
      if (sm === "exit") {
        return this.destroySocket();
      }

      const { type, data } = JSON.parse(sm);
      switch (type) {
        case "unauthorized":
          // The user is not allowed to use this app, force them to logout.
          // NOTE: This is _horrible_ from a security standpoint, but it's good
          //       enough for this app's threat model.
          this.logout();
          break;
        case "su-reply":
          this.processSuReply(data);
          break;
        case "tm-message":
          this.processTmMessage(data);
          break;
        case "phone-connected":
          this.$refs.phone.connected(data);
          break;
        case "phone-disconnected":
          this.$refs.phone.disconnected(data.user);
          break;
        default:
          console.log(`Unknown socket message type ${type} (data: ${data})`);
      }
    },
    processSuReply({ to, msg }) {
      switch (to) {
        case "info":
          this.authorized = true;
          this.$refs.phone.initialize(msg);
          break;
        default:
          console.log(`Unknown su reply type ${to} (msg: ${msg})`);
      }
    },
    processTmMessage(data) {
      if (!this.authorized) return;
      this.tmLog.push(data);
    },
    destroySocket() {
      this.allowReopen = false;
      if (this.ws) {
        delete this.ws.onclose;
        this.ws.close();
      }
    },
  },
  created() {
    this.openSocket();
  },
  beforeDestroy() {
    this.destroySocket();
  },
};
</script>

<style lang="less" scoped></style>
