<template>
  <div class="main-content mobile">
    <div class="nook-phone-container">
      <div class="time-bar">
        <div></div>
        <div>{{ datenow }}</div>
        <div @click="toggleLangSwitcher">{{ lang.languageShort }}</div>
      </div>
      <div class="langSwitcher" :class="langSwitcherOpen ? 'open' : 'closed'">
        <div
          class="lang"
          v-for="language in languages"
          :key="language"
          @click="switchLang(language)"
        >{{ language }}</div>
      </div>
      <div class="arrow-down" @click="scrollDown"></div>
      <div class="error" v-if="importError">{{ lang.importExport.importError }}</div>
      <div class="error" v-if="exportError">{{ lang.importExport.exportError }}</div>
      <div class="control-bar">
        <div class="arrow-back" @click="toggleFeedback" v-if="page === 2"></div>
        <div class="phone-head" v-if="page === 1">{{ mobileChoice }}</div>
        <div class="phone-head" v-if="page === 2">{{ lang.feedback.title }}</div>
      </div>
      <div class="nook-phone-main" :class="page == 1 ? 'show' : 'hide'">
        <div
          class="overlay"
          :class="overlayOpen ? 'display' : 'hide'"
          @click.prevent.stop="openCloseOverlay"
        ></div>
        <div class="nook-phone-apps">
          <div
            class="custom-button"
            :class="(!!mobileChoice && mobileChoice === 'fish') ? 'active' : ''"
            @click="choose('fish')"
          >
            <div class="icon-image-container">
              <img class="icon-image" src="~@/assets/fish_icon.png" />
            </div>
          </div>
          <div
            class="custom-button"
            :class="(!!mobileChoice && mobileChoice === 'insects') ? 'active' : ''"
            @click="choose('insects')"
          >
            <div class="icon-image-container">
              <img class="icon-image" src="~@/assets/insects_icon.png" />
            </div>
          </div>
          <div
            class="custom-button"
            :class="(!!mobileChoice && mobileChoice === 'songs') ? 'active' : ''"
            @click="choose('songs')"
          >
            <div class="icon-image-container">
              <img class="icon-image songs" src="~@/assets/songs_icon.png" />
            </div>
          </div>
          <div
            class="custom-button"
            :class="(!!mobileChoice && mobileChoice === 'golden-tools') ? 'active' : ''"
            @click="choose('golden-tools')"
          >
            <div class="icon-image-container">
              <img class="icon-image" src="~@/assets/tools_icon.png" />
            </div>
          </div>
          <div class="custom-button mini" @click.stop="openCloseImportExport">
            <div
              class="icon-image-container"
              :class="(!!mobileChoice && mobileChoice == 'Import / Export')"
            >
              <img class="icon-image imexport-image" src="~@/assets/import_export.png" />
            </div>
          </div>
          <div class="custom-button mini" @click="toggleNhSh">
            <div class="icon-image-container" :class="loc == 'NH' ? 'nh' : 'sh'">
              <img class="icon-image globe" src="~@/assets/globe_icon.png" />
              <div class="x small">{{ loc }}</div>
            </div>
          </div>

          <div class="importexport one" @click="handleImport">
            <div
              class="icon-image-container"
              :class="(!!mobileChoice && mobileChoice === 'import') ? 'active' : ''"
            >
              <img class="icon-image imexport-image" src="~@/assets/import_icon.png" />
            </div>
          </div>
          <div class="importexport two" @click="handleExport">
            <div
              class="icon-image-container"
              :class="(!!mobileChoice && mobileChoice === 'export') ? 'active' : ''"
            >
              <img class="icon-image imexport-image" src="~@/assets/export_icon.png" />
            </div>
          </div>

          <div class="custom-button mini" @click="toggleFeedback">
            <div class="icon-image-container">
              <img class="icon-image imexport-image" src="~@/assets/feedback_icon.png" />
            </div>
          </div>
        </div>

        <label
          for="settings"
          :class="importExportActive ? 'active' : 'inactive'"
          class="import-code"
          v-show="showCode && page != 2"
        >
          {{ lang.importExport.code }}
          <input
            type="text"
            id="import-export"
            name="import-export"
            v-model="importExportData"
          />
        </label>
        <div v-if="showSuccess && !showCode" class="import-code">{{ lang.importExport.success }}</div>
      </div>
      <div class="nook-phone-secondary" :class="page == 2 ? 'show' : 'hide'">
        <div class="feedback">
          <form class="form" method="POST" name="feedback">
            <input type="hidden" name="form-name" value="feedback" />
            <label for="name">
              {{ lang.global.name }}:
              <input type="text" name="name" />
            </label>
            <label for="email">
              {{ lang.feedback.email }}:
              <input type="email" name="email" />
            </label>
            <label for="message">
              {{ lang.feedback.message }}:
              <textarea name="message"></textarea>
            </label>
            <button type="submit" class="custom-button mini">{{ lang.feedback.send }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store/index.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      page: 1,
      importExportData: "",
      mobileChoice: this.choice || "Fish",
      datenow: "",
      preventCode: false,
      langSwitcherOpen: false
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  props: {
    choice: {
      type: String,
      default: "fish"
    },
    importExportActive: {
      type: Boolean
    },
    importExport: {
      type: String
    },
    exportError: {
      type: Boolean
    },
    importError: {
      type: Boolean
    },
    showSuccess: {
      type: Boolean
    }
  },
  watch: {
    choice(val) {
      if (
        this.mobileChoice == this.lang.global.import ||
        this.mobileChoice == this.lang.global.export
      ) {
        if (val != "import" && val != "export") {
          this.preventCode = true;
        }
      }
      this.evalMobileChoice(val);
    },
    importExport(val) {
      if (val.length > 0) {
        this.importExportData = val;
      }
    }
  },
  computed: {
    showCode() {
      return (
        !this.preventCode ||
        (this.mobileChoice == this.lang.global.import && !this.showSuccess) ||
        (this.mobileChoice != this.lang.global.export &&
          this.importExport.length != 0) ||
        (this.mobileChoice == this.lang.global.export &&
          this.importExport.length > 0)
      );
    },
    ...mapState(["loc", "overlayOpen", "lang", "languages", "displayData"])
  },
  methods: {
    evalMobileChoice(choice) {
      let myChoice = choice || this.displayData;
      switch (myChoice) {
        case "fish":
          this.mobileChoice = this.lang.global.fish;
          break;
        case "insects":
          this.mobileChoice = this.lang.global.insects;
          break;
        case "golden-tools":
          this.mobileChoice = this.lang.header.goldenTools;
          break;
        case "songs":
          this.mobileChoice = this.lang.global.songs;
          break;
        default:
          this.mobileChoice = choice || this.displayData;
          break;
      }
    },
    switchLang(lang) {
      store.dispatch("switchLang", lang);
      this.toggleLangSwitcher();
      this.evalMobileChoice();
    },
    toggleLangSwitcher() {
      this.langSwitcherOpen = !this.langSwitcherOpen;
    },
    toggleNhSh() {
      store.commit("toggleLoc");
      this.mobileChoice =
        this.loc == "NH"
          ? this.lang.hemispheres.northern
          : this.lang.hemispheres.southern;
    },
    openCloseOverlay() {
      store.commit("toggleOverlay");
    },
    openCloseImportExport() {
      this.mobileChoice =
        this.lang.global.import + " / " + this.lang.global.export;
      store.commit("toggleOverlay");
    },
    toggleLocation() {
      store.commit("toggleLoc");
    },
    time() {
      let hours = new Date().getHours().toString();
      let minutes = new Date().getMinutes().toString();
      if (hours.length === 1) {
        hours = "0" + hours;
      }
      if (minutes.length === 1) {
        minutes = "0" + minutes;
      }
      this.datenow = hours + ":" + minutes;
    },
    toggleFeedback() {
      if (this.page === 1) {
        this.page = 2;
      } else this.page = 1;
    },
    choose(choice) {
      this.evalMobileChoice(choice);
      this.$emit("choose", choice);
    },
    scrollDown() {
      document.querySelector("#waypoint1").scrollIntoView({
        behavior: "smooth"
      });
    },
    handleImport() {
      this.openCloseOverlay();
      this.mobileChoice = this.lang.global.import;
      this.$emit("handleImport", this.importExportData);
    },
    handleExport() {
      this.openCloseOverlay();
      this.mobileChoice = this.lang.global.export;
      this.$emit("handleExport");
    }
  },
  mounted() {
    this.interval = setInterval(this.time, 1000);
    this.evalMobileChoice(this.displayData);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>