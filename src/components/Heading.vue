<template>
  <div class="stuff">
    <div class="header">
      <h1>Animal Crossing: New Horizon Helper</h1>
    </div>

    <div class="main-content-wrapper">
      <!-- MOBILE -->
      <MobileHeading
        v-if="isMobile"
        :choice="choice"
        :importExportActive="importExportActive"
        :importExport="importExport"
        :exportError="exportError"
        :importError="importError"
        :showSuccess="showSuccess"
        @choose="choose"
        @handleImport="handleImport"
        @handleExport="handleExport"
      />
      <!-- DESKTOP -->
      <DesktopHeading
        v-else
        :choice="choice"
        :importExportActive="importExportActive"
        :importExport="importExport"
        :exportError="exportError"
        :importError="importError"
        :feedbackOpenClose="feedbackOpenClose"
        :showSuccess="showSuccess"
        @choose="choose"
        @handleImport="handleImport"
        @handleExport="handleExport"
        @toggleFeedback="toggleFeedback"
      />
    </div>
  </div>
</template>
<script>
import MobileHeading from "./MobileHeading.vue";
import DesktopHeading from "./DesktopHeading.vue";
import store from "../store/index.js";
import Fish from "../data/fish.json";
import Insects from "../data/insects.json";
import { mapState } from "vuex";
import { queryForIndexes, queryByIndex, mobileCheck } from "../utils/helper.js";

export default {
  data() {
    return {
      exportError: false,
      importError: false,
      importExport: "",
      feedbackOpenClose: "",
      isMobile: false,
      importExportActive: false,
      showSuccess: false
    };
  },
  components: {
    MobileHeading,
    DesktopHeading
  },
  mounted() {
    this.isMobile = mobileCheck();
  },
  watch: {
    importError(val) {
      if (!!val) {
        setTimeout(() => {
          this.importError = false;
        }, 2000);
      }
    },
    exportError(val) {
      if (!!val) {
        setTimeout(() => {
          this.exportError = false;
        }, 2000);
      }
    }
  },
  methods: {
    choose(data) {
      this.importError = false;
      this.exportError = false;
      this.importExportActive = false;
      store.commit("assignDisplayData", data);
      store.dispatch("storeSelection");
    },
    toggleFeedback() {
      this.importError = false;
      this.exportError = false;
      this.feedbackOpenClose = this.feedbackOpenClose.length > 0 ? "" : "open";
    },
    handleExport() {
      this.importError = false;
      this.exportError = false;
      this.importExportActive = true;
      const isOldData = localStorage.getItem("myfishies");
      const pattern = /([a-z])([A-Z])/g;
      let newData;

      // determine whether the savedata is legacy data and save accordingly
      if (!!isOldData) {
        newData = [
          {
            caught: {
              fish: localStorage
                .getItem("myfishies")
                .replace(pattern, "$1,$2")
                .split(","),
              insects: localStorage
                .getItem("myinsecties")
                .replace(pattern, "$1,$2")
                .split(",")
            }
          }
        ];
      } else {
        newData = [
          {
            caught: {
              fish: JSON.parse(localStorage.getItem("caught"))
                ? JSON.parse(localStorage.getItem("caught")).fish
                : [],
              insects: JSON.parse(localStorage.getItem("caught"))
                ? JSON.parse(localStorage.getItem("caught")).insects
                : []
            }
          }
        ];
      }
      // get golden-tool counts
      let counts = {
        shovelCount: localStorage.getItem("shovelCount") || 0,
        axeCount: localStorage.getItem("axeCount") || 0,
        balloonCount: localStorage.getItem("balloonCount") || 0,
        wateringcanCount: localStorage.getItem("wateringcanCount") || 0
      };
      // save all to newData
      newData = [...newData, counts];
      let exportFish;
      let exportInsects;
      // create the export string for fish and insects
      if (!newData[0].caught) {
        this.exportError = true;
        return;
      }
      exportFish = queryForIndexes(newData[0].caught.fish, Fish).toString();
      exportInsects = queryForIndexes(
        newData[0].caught.insects,
        Insects
      ).toString();
      // only pass values if there are any fish or insects to begin with
      exportFish = exportFish.length > 0 ? "f:" + exportFish + "|" : "";
      exportInsects = exportInsects.length > 0 ? "i:" + exportInsects : "";
      let exportCounts =
        (counts.shovelCount == 0 ? "" : "|sc:" + counts.shovelCount) +
        (counts.axeCount == 0 ? "" : "|ac:" + counts.axeCount) +
        (counts.balloonCount == 0 ? "" : "|bc:" + counts.balloonCount) +
        (counts.wateringcanCount == 0 ? "" : "|wc:" + counts.wateringcanCount);
      const exportString = exportFish + exportInsects + exportCounts;
      if (exportString == "|" || exportString == "") {
        this.exportError = true;
        return;
      } else {
        this.exportError = false;
      }
      this.importExport = exportString;
    },
    handleImport(data) {
      this.importError = false;
      this.exportError = false;
      if ((this.isMobile && !this.importExportActive) || data.length === 0) {
        this.importExportActive = true;
        return;
      }
      const importValue = data;
      this.importExport = "";
      const fishPattern = /f:([\d,]*)\|?.*/;
      const insectsPattern = /.*i:([\d,]*)\|?.*/;
      const axeCountPattern = /ac:(\d)/;
      const shovelCountPattern = /sc:(\d)/;
      const balloonCountPattern = /bc:(\d)/;
      const wateringcanCountPattern = /wc:(\d)/;
      let fish = [];
      let insects = [];

      if (fishPattern.test(importValue))
        fish = importValue.replace(fishPattern, "$1").split(",");
      if (insectsPattern.test(importValue))
        insects = importValue.replace(insectsPattern, "$1").split(",");
      const axeCount = axeCountPattern.exec(importValue) || 0;
      const shovelCount = shovelCountPattern.exec(importValue) || 0;
      const balloonCount = balloonCountPattern.exec(importValue) || 0;
      const wateringcanCount = wateringcanCountPattern.exec(importValue) || 0;

      const caught = {
        fish: queryByIndex(fish, Fish),
        insects: queryByIndex(insects, Insects)
      };

      localStorage.setItem("caught", JSON.stringify(caught));
      localStorage.setItem("axeCount", axeCount);
      localStorage.setItem("shovelCount", shovelCount);
      localStorage.setItem("balloonCount", balloonCount);
      localStorage.setItem("wateringcanCount", wateringcanCount);
      store.dispatch("getData");
      this.importExportActive = false;
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 1500);
    }
  },
  computed: {
    ...mapState({ choice: "displayData" })
  }
};
</script>