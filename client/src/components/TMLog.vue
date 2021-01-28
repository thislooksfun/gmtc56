<template>
  <v-card max-width="500" class="mx-auto mt-5 m">
    <v-card-title>
      <h3>Word from the TMs</h3>
    </v-card-title>

    <v-card-text>
      <v-container
        ref="container"
        style="max-height: 25em"
        class="overflow-y-auto"
      >
        <v-row v-for="msg in messages" :key="msg.id">
          <span class="secondary--text me-1">{{
            formatTime(msg.timestamp)
          }}</span>
          <span class="me-1">(#{{ msg.channel }})</span>
          <span class="font-weight-bold me-1">{{ msg.author }}:</span>
          <span>{{ msg.msg }}</span>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { VCard, VCardTitle, VRow } from "vuetify/lib";

export default {
  name: "TMLog",
  components: {
    VCard,
    VCardTitle,
    VRow,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatTime(ts) {
      return new Date(ts).toLocaleString();
    },
    scrollToEnd() {
      const c = this.$refs.container;
      c.scrollTop = c.scrollHeight;
    },
  },
  updated() {
    this.scrollToEnd();
  },
  mounted() {
    this.scrollToEnd();
  },
};
</script>

<style lang="less" scoped></style>
