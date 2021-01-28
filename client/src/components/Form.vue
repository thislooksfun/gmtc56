<template>
  <v-card max-width="500" class="mx-auto mt-5 m">
    <v-card-title>
      <h3>Team Info</h3>
    </v-card-title>

    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model.number="questionNumber"
          label="Question"
          type="number"
          required
          :rules="numberRules('Question')"
        ></v-text-field>
        <v-text-field
          v-model.number="teamNumber"
          label="Team Number"
          type="number"
          required
          :rules="numberRules('Team Number')"
        ></v-text-field>
        <v-text-field v-model="teamName" label="Team Name"></v-text-field>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="clearForm" plain>Clear</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="submitForm" color="primary">Submit</v-btn>
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
  VForm,
  VSpacer,
  VTextField,
} from "vuetify/lib";
import * as api from "../api";

function isInteger(v) {
  if (typeof v === "string") v = parseInt(v);
  return !isNaN(v) && v === Math.round(v);
}

export default {
  name: "Form",
  components: {
    VBtn,
    VCard,
    VCardActions,
    VCardTitle,
    VDivider,
    VForm,
    VSpacer,
    VTextField,
  },
  data() {
    return {
      questionNumber: null,
      teamNumber: null,
      teamName: "",
    };
  },
  computed: {
    numberRules() {
      return name => [
        v => !!v || `${name} is required`,
        v => isInteger(v) || `${name} must be an integer`,
      ];
    },
  },
  methods: {
    clearForm() {
      this.$refs.form.reset();
    },
    submitForm() {
      if (!this.$refs.form.validate()) return;
      api
        .recordAnswer(this.questionNumber, this.teamNumber, this.teamName)
        .then(() => {
          const qn = this.questionNumber;
          this.$refs.form.reset();
          this.questionNumber = qn;
        })
        .catch(e => {
          console.error("Unable to submit form:", e);
          this.$emit("status", {
            status: "Unable to submit form",
            color: "error",
            duration: 5000,
          });
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
