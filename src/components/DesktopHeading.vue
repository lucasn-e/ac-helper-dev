<template>
  <div class="main-content">
    <div class="select-container">
      <div
        class="custom-button"
        :class="(!!choice && choice === 'fish') ? 'active' : ''"
        @click="choose('fish')"
      >
        <div>Fish</div>
      </div>
      <div
        class="custom-button"
        :class="(!!choice && choice === 'insects') ? 'active' : ''"
        @click="choose('insects')"
      >
        <div>Insects</div>
      </div>
      <div
        class="custom-button"
        :class="(!!choice && choice === 'golden-tools') ? 'active' : ''"
        @click="choose('golden-tools')"
      >
        <div>Golden Tools</div>
      </div>
    </div>

    <div class="import-export">
      <div class="custom-button mini" @click="handleImport">
        <div>Import Data</div>
      </div>
      <div class="custom-button mini" @click="handleExport">
        <div>Export Data</div>
      </div>
      <div
        class="custom-button mini"
        @click="toggleLocation"
      >
        <div class="swap-nh-sh">{{ nhShText }}</div>
      </div>
      <div
        class="error"
        v-if="importError"
      >Error: no import code entered! Please enter your import code in the text field before pressing "Import Data"!</div>
      <div class="error" v-if="exportError">Error: you have no saved data to export!</div>
      <label for="import-export" v-if="showCode && importExportActive">
        Code:
        <input type="text" id="import-export" name="import-export" v-model="importExportData" />
      </label>
      <div v-if="showSuccess && !showCode" class="import-code">Successfully imported!</div>
    </div>
  </div>
</template>
<script>
import store from '../store/index.js';
import {mapState} from 'vuex';

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
      store.commit('toggleLoc');
    },
    toggleFeedback() {
      this.$emit("toggleFeedback");
    },
    choose(choice) {
      this.$emit("choose", choice);
    },
    scrollDown() {
      document.querySelector("#waypoint1").scrollIntoView({
        behavior: "smooth"
      });
    },
    handleImport() {
      this.mobileChoice = "import";
      this.$emit("handleImport", this.importExportData);
    },
    handleExport() {
      this.mobileChoice = "export";
      this.$emit("handleExport");
    }
  },
  computed: {
    nhShText() {
      return this.loc == 'NH' ? 'Northern Hemisphere' : 'Southern Hemisphere'
    },
    showFeedback() {
      return (
        window.location.href == "https://ac-helper.com/" ||
        window.location.href == "http://localhost:8080/"
      );
    },
    showCode() {
      return (
        (this.mobileChoice == "import" && !this.showSuccess) ||
        (this.mobileChoice != "export" && this.importExport.length != 0) ||
        (this.mobileChoice == "export" && this.importExport.length > 0)
      );
    },
    ...mapState(['loc'])
  }
};
</script>