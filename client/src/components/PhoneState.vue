<template>
  <v-card max-width="500" class="mx-auto mt-5 m">
    <v-card-title>
      <h3>Phone Line</h3>
    </v-card-title>

    <v-card-text>
      <span v-if="loading">Loading...</span>
      <span v-else-if="!inPhoneRoom">Please join a phone room.</span>
      <span v-else-if="!inCall">Nobody on the line</span>
      <span v-else>In a call with {{ otherUser.name }}</span>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="inCall"
        color="error"
        @click="hangup"
        :loading="loading"
        :disabled="!inPhoneRoom"
      >
        <v-icon left>mdi-phone-off</v-icon> Hang up
      </v-btn>
      <v-btn
        v-else
        color="primary"
        @click="next"
        :loading="loading"
        :disabled="!inPhoneRoom"
      >
        <v-icon left>mdi-phone-in-talk</v-icon> Next caller
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  VBtn,
  VCard,
  VCardActions,
  VCardTitle,
  VDivider,
  VSpacer,
} from "vuetify/lib";

import * as api from "../api";

export default {
  name: "PhoneState",
  components: {
    VBtn,
    VCard,
    VCardActions,
    VCardTitle,
    VDivider,
    VSpacer,
  },
  data() {
    return {
      loading: true,
      inPhoneRoom: false,
      otherUser: null,
    };
  },
  computed: {
    inCall() {
      return this.inPhoneRoom && this.otherUser != null;
    },
  },
  methods: {
    hangup() {
      this.loading = true;
      api.hangup();
    },
    next() {
      this.loading = true;
      api.next();
    },
    initialize({ inPhoneRoom, otherUser }) {
      this.inPhoneRoom = !!inPhoneRoom;
      this.otherUser = otherUser;
      this.loading = false;
    },
    connected(user) {
      this.otherUser = user;
      this.loading = false;
    },
    disconnected() {
      this.otherUser = null;
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
