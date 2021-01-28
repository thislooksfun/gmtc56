<template>
  <v-app id="app">
    <v-container>
      <StatusBar :status="status" />
      <Logo />
      <Login
        v-if="loading || !loggedIn"
        :loading="loading"
        :loginUrl="loginUrl"
      />
      <Main v-else :user="user" @status="setStatus" @logout="logout" />
    </v-container>
  </v-app>
</template>

<script>
import { VApp } from "vuetify/lib";

import StatusBar from "@/components/StatusBar.vue";
import Login from "@/components/Login.vue";
import Logo from "@/components/Logo.vue";
import Main from "@/components/Main.vue";

import * as api from "./api";

export default {
  name: "Home",
  components: {
    VApp,
    StatusBar,
    Login,
    Logo,
    Main,
  },
  data() {
    return {
      loading: true,
      loginUrl: null,
      user: null,
      status: null,
      statusTimeout: null,
    };
  },
  computed: {
    loggedIn() {
      return this.user != null;
    },
  },
  methods: {
    logout() {
      api.logout().then(() => (this.user = null));
    },
    setStatus({ status, color, duration }) {
      clearTimeout(this.statusTimeout);
      this.status = { status, color };

      if (duration > 0) {
        this.statusTimeout = setTimeout(() => {
          this.status = null;
        }, duration);
      }
    },
    prefersDarkMode() {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    },
    setColorScheme() {
      this.$vuetify.theme.dark = this.prefersDarkMode();
      console.log(
        `Set color scheme to ${this.$vuetify.theme.dark ? "dark" : "light"}`
      );
    },
    trackPreferredColorScheme() {
      if (!window.matchMedia) return;
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkMediaQuery.addEventListener("change", () => this.setColorScheme());
      this.setColorScheme();
    },
  },
  created() {
    this.trackPreferredColorScheme();
    Promise.all([
      api.getLoginUrl().then(url => (this.loginUrl = url)),
      api.getUser().then(user => (this.user = user)),
    ]).then(() => (this.loading = false));
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
