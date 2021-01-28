import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

enum DiscordColors {
  Blurple = "#7289da",
  Greyple = "#99aab5",
  DarkButNotBlack = "#2c2f33",
  NotQuiteBlack = "#23272a",
  ActuallyBlack = "#000000",
}

export default new Vuetify({
  theme: {
    themes: {
      light: {
        error: colors.red.accent4,
        accent: DiscordColors.Blurple,
      },
      dark: {
        error: colors.red.accent4,
        accent: DiscordColors.Blurple,
      },
    },
  },
});
