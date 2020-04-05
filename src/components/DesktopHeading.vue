<template>
  <div class="main-content">
    <h3>Choose your topic:</h3>
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
    <!--<div v-if="showFeedback" class="feedback" :class="feedbackOpenClose">
      <div class="fullwidth-container">
        <div class="custom-button mini" @click="toggleFeedback">Feedback</div>
      </div>
      <form class="form" method="POST" name="feedback">
        <input type="hidden" name="form-name" value="feedback" />
        <label for="name">
          Name:
          <input type="text" name="name" />
        </label>
        <label for="email">
          Email:
          <input type="email" name="email" />
        </label>
        <label for="message">
          Message:
          <textarea name="message"></textarea>
        </label>
        <button type="submit" class="custom-button mini">Send</button>
      </form>
    </div>-->
  </div>
</template>
<script>
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
    }
  }
};
</script>