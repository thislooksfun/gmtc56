<template>
  <div class="login">
    <v-btn :href="loginUrl" x-large color="accent" :loading="loading">
      <span class="login-btn-content">
        <span>Log in with</span>
        <img src="../assets/discord-logo.svg" alt="Discord" />
      </span>
    </v-btn>
  </div>
</template>

<script>
import { VBtn } from "vuetify/lib";

export default {
  name: "Login",
  components: {
    VBtn,
  },
  props: {
    loginUrl: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
.login-btn-content img {
  height: 2.2em;
  vertical-align: middle;
}
</style>
