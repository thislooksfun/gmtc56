<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <a :href="authUrl">Log in with Discord</a>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    authUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
a {
  font-size: 2em;
}
</style>
