<template>
  <div class="main-content mobile">
    <div class="nook-phone-container">
      <div class="time-bar">{{ datenow }}</div>
      <div class="arrow-down" @click="scrollDown"></div>
      <div
        class="error"
        v-if="importError"
      >Error: no import code entered! Please enter your import code in the text field before pressing "Import Data"!</div>
      <div class="error" v-if="exportError">Error: you have no saved data to export!</div>
      <div class="control-bar">
        <div class="arrow-back" @click="toggleFeedback" v-if="page === 2"></div>
        <h3 v-if="page === 1">{{ mobileChoice | capitalize }}</h3>
        <h3 v-if="page === 2">Feedback</h3>
      </div>

      <div class="nook-phone-main" :class="page == 1 ? 'show' : 'hide'">
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
          :class="(!!mobileChoice && mobileChoice === 'golden-tools') ? 'active' : ''"
          @click="choose('golden-tools')"
        >
          <div class="icon-image-container">
            <img class="icon-image" src="~@/assets/tools_icon.png" />
          </div>
        </div>

        <div class="custom-button mini" @click="handleImport">
          <div
            class="icon-image-container"
            :class="(!!mobileChoice && mobileChoice === 'import') ? 'active' : ''"
          >
            <img class="icon-image imexport-image" src="~@/assets/import_icon.png" />
          </div>
        </div>
        <div class="custom-button mini" @click="handleExport">
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
        for="import-export"
        :class="importExportActive ? 'active' : 'inactive'"
        class="import-code"
        v-show="showCode && page != 2"
      >
        Code:
        <input type="text" id="import-export" name="import-export" v-model="importExportData" />
      </label>
      <div v-if="showSuccess && !showCode" class="import-code">Successfully imported!</div>

      <div class="nook-phone-secondary" :class="page == 2 ? 'show' : 'hide'">
        <div class="feedback">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      page: 1,
      importExportData: "",
      mobileChoice: this.choice || "Fish",
      datenow: "",
      preventCode: false
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
      if (this.mobileChoice == "import" || this.mobileChoice == "export") {
        if (val != "import" && val != "export") {
          this.preventCode = true;
        }
      }
      this.mobileChoice = val;
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
        (this.mobileChoice == "import" && !this.showSuccess) ||
        (this.mobileChoice != "export" && this.importExport.length != 0) ||
        (this.mobileChoice == "export" && this.importExport.length > 0)
      );
    }
  },
  methods: {
    time() {
      this.datenow = moment().format("HH:mm");
    },
    toggleFeedback() {
      if (this.page === 1) {
        this.page = 2;
      } else this.page = 1;
    },
    choose(choice) {
      this.mobileChoice = choice;
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
  mounted() {
    this.interval = setInterval(this.time, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>