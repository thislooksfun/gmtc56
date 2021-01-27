<template>
  <div class="login">
    <a class="login-button" :href="loginUrl">
      <span>Log in with</span>
      <img src="../assets/discord-logo.svg" alt="Discord"
    /></a>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    loginUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.login-button {
  font-size: 2em;
  color: var(--dc-full-white);
  background-color: var(--dc-burple);
  display: inline-block;
  padding: 0.15em 0.2em 0 0.5em;
  text-decoration: none;
  position: relative;

  &:hover::after {
    text-decoration: underline;
    content: "";
    background-color: #0001;
    position: absolute;
    height: 100%;
    width: 100%;
    display: block;
    top: 0;
    left: 0;
  }

  &,
  &:hover::after {
    border-radius: 0.25em;
  }

  img {
    height: 2em;
    vertical-align: middle;
  }
}
</style>
