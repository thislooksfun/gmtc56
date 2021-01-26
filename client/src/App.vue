<template>
  <div id="app">
    <Loading v-if="loading" />
    <Main v-else-if="loggedIn" />
    <Login v-else :authUrl="authUrl" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import Login from "@/components/Login.vue";
import Main from "@/components/Main.vue";

export default {
  name: "Home",
  components: {
    Loading,
    Login,
    Main,
  },
  data() {
    return {
      loading: true,
      loggedIn: false,
      authUrl: "#hello",
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;

      setTimeout(() => {
        this.loggedIn = true;
      }, 5000);
    }, 1000);
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
