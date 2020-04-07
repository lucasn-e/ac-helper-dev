<template>
  <div class="main-content">
    <div class="select-container">
      <div
        class="custom-button"
        :class="(!!choice && choice === 'fish') ? 'active' : ''"
        @click="choose('fish')"
      >
        <div>{{ lang.global.fish }}</div>
      </div>
      <div
        class="custom-button"
        :class="(!!choice && choice === 'insects') ? 'active' : ''"
        @click="choose('insects')"
      >
        <div>{{ lang.global.insects }}</div>
      </div>
      <div
        class="custom-button"
        :class="(!!choice && choice === 'golden-tools') ? 'active' : ''"
        @click="choose('golden-tools')"
      >
        <div>{{ lang.header.goldenTools }}</div>
      </div>
    </div>

    <div class="settings">
      <div class="custom-button mini" @click="handleImport">
        <div>{{ lang.header.import }}</div>
      </div>
      <div class="custom-button mini" @click="handleExport">
        <div>{{ lang.header.export }}</div>
      </div>
      <div class="custom-button mini" @click="toggleLocation">
        <div class="swap-nh-sh">{{ nhShText }}</div>
      </div>
      <div class="error" v-if="importError">{{ lang.importExport.importError }}</div>
      <div class="error" v-if="exportError">{{ lang.importExport.exportError }}</div>
      <label for="import-export" v-if="showCode && importExportActive">
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
  </div>
</template>
<script>
import store from "../store/index.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      importExportData: "",
      mobileChoice: ""
    };
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
    feedbackOpenClose: {
      type: String
    },
    showSuccess: {
      type: Boolean
    }
  },
  watch: {
    importExport(val) {
      if (val.length > 0) {
        this.importExportData = val;
      }
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    toggleLocation() {
      store.commit("toggleLoc");
    },
    toggleFeedback() {
      this.$emit("toggleFeedback");
    },
    choose(choice) {
      this.mobileChoice =
        choice == "fish"
          ? this.lang.global.fish
          : choice == "insects"
          ? this.lang.global.insects
          : this.lang.header.goldenTools;
      this.$emit("choose", choice);
    },
    scrollDown() {
      document.querySelector("#waypoint1").scrollIntoView({
        behavior: "smooth"
      });
    },
    handleImport() {
      this.mobileChoice = this.lang.global.import;
      this.$emit("handleImport", this.importExportData);
    },
    handleExport() {
      this.mobileChoice = this.lang.global.export;
      this.$emit("handleExport");
    }
  },
  computed: {
    nhShText() {
      return this.loc == "NH" ? "Northern Hemisphere" : "Southern Hemisphere";
    },
    showCode() {
      return (
        (this.mobileChoice == "import" && !this.showSuccess) ||
        (this.mobileChoice != "export" && this.importExport.length != 0) ||
        (this.mobileChoice == "export" && this.importExport.length > 0)
      );
    },
    ...mapState(["loc", "lang"])
  }
};
</script>