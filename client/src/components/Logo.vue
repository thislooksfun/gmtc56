<template>
  <v-img
    class="gmtc-logo my-8 mx-auto"
    width="100%"
    max-width="225"
    aspect-ratio="1"
    alt="Great Midwest Trivia Contest 56"
    src="../assets/gmtc56-logo.png"
  >
  </v-img>
</template>

<script>
import { VImg } from "vuetify/lib";

export default {
  name: "Logo",
  components: {
    VImg,
  },
};
</script>

<style>
.gmtc-logo {
  border-radius: 50%;
  margin: 30px 0;
}
</style>
