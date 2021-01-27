<template>
  <div id="app">
    <Logo />
    <Loading v-if="loading" />
    <Main v-else-if="loggedIn" :user="user" />
    <Login v-else :loginUrl="loginUrl" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import Login from "@/components/Login.vue";
import Logo from "@/components/Logo.vue";
import Main from "@/components/Main.vue";
import * as api from "./api";

export default {
  name: "Home",
  components: {
    Loading,
    Login,
    Logo,
    Main,
  },
  data() {
    return {
      loading: true,
      loginUrl: null,
      user: null,
    };
  },
  computed: {
    loggedIn() {
      return this.user != null;
    },
  },
  methods: {
    logout() {
      this.api.logout().then(() => {
        this.user = null;
      });
    },
  },
  created() {
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
