<template>
  <div class="stuff">
    <div class="header">
      <h1>Animal Crossing: New Horizon Helper</h1>
    </div>

    <div class="main-content-wrapper">
      <div class="main-content">
        <div v-if="isMobile" class="arrow-down" @click="scrollDown"></div>
        <h3 v-if="!isMobile">Choose your topic:</h3>
        <h3 v-else>{{ choice }}</h3>
        <div class="select-container">
          <div
            class="custom-button"
            :class="(!!choice && choice === 'fish') ? 'active' : ''"
            @click="choose('fish')"
          >
            <div class="icon-image-container" v-if="isMobile">
              <img class="icon-image" src="~@/assets/fish_icon.png" />
            </div>
            <div v-else>Fish</div>
          </div>
          <div
            class="custom-button"
            :class="(!!choice && choice === 'insects') ? 'active' : ''"
            @click="choose('insects')"
          >
            <div class="icon-image-container" v-if="isMobile">
              <img class="icon-image" src="~@/assets/insects_icon.png" />
            </div>
            <div v-else>Insects</div>
          </div>
          <div
            class="custom-button"
            :class="(!!choice && choice === 'golden-tools') ? 'active' : ''"
            @click="choose('golden-tools')"
          >
            <div class="icon-image-container" v-if="isMobile">
              <img class="icon-image" src="~@/assets/tools_icon.png" />
            </div>
            <div v-else>Golden Tools</div>
          </div>
        </div>
        <div class="import-export">
          <div class="custom-button mini" @click="handleImport">
            <div class="icon-image-container" v-if="isMobile">
              <img class="icon-image imexport-image" src="~@/assets/import_icon.png" />
            </div>
            <div v-else>Import Data</div>
          </div>
          <div class="custom-button mini" @click="handleExport">
            <div class="icon-image-container" v-if="isMobile">
              <img class="icon-image imexport-image" src="~@/assets/export_icon.png" />
            </div>
            <div v-else>Export Data</div>
          </div>
          <div v-if="isMobile" class="custom-button mini" @click="toggleFeedback">
            <div class="icon-image-container">
              <img class="icon-image imexport-image" src="~@/assets/feedback_icon.png" />
            </div>
          </div>
          <div
            class="error"
            v-if="importError"
          >Error: no import code entered! Please enter your import code in the text field before pressing "Import Data"!</div>
          <div class="error" v-if="exportError">Error: you have no saved data to export!</div>
          <label for="import-export" v-if="!isMobile">
            Code:
            <input type="text" id="import-export" name="import-export" v-model="importExport" />
          </label>
        </div>
        <label
          for="import-export"
          v-if="isMobile"
          :class="importExportActive ? 'active' : 'inactive'"
          class="import-code"
        >
          Code:
          <input type="text" id="import-export" name="import-export" v-model="importExport" />
        </label>
        <div v-if="showFeedback" class="feedback" :class="feedbackOpenClose">
          <div class="fullwidth-container" v-if="!isMobile">
            <div class="custom-button mini" @click="toggleFeedback">Feedback</div>
          </div>
          <form class="form" data-netlify="true" method="POST" name="contact">
            <label for="name">
              Name:
              <input type="text" name="name" id="name" />
            </label>
            <label for="email">
              Email:
              <input type="email" name="email" id="email" />
            </label>
            <label for="message">
              Message:
              <textarea name="message" id="message"></textarea>
            </label>
            <button type="submit" class="custom-button mini" @click="formSent">Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
      importExportActive: false
    };
  },
  mounted() {
    this.isMobile = mobileCheck();
  },
  methods: {
    scrollDown() {
      document.querySelector("#waypoint1").scrollIntoView({
        behavior: "smooth"
      });
    },
    formSent() {
      this.feedbackOpenClose = "";
    },
    choose(data) {
      store.commit("assignDisplayData", data);
      store.dispatch("storeSelection");
    },
    toggleFeedback() {
      this.feedbackOpenClose = this.feedbackOpenClose.length > 0 ? "" : "open";
    },
    handleExport() {
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
      exportFish = exportFish.length > 0 ? "f:" + exportFish : "";
      exportInsects = exportInsects.length > 0 ? "|i:" + exportInsects : "";
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
    handleImport() {
      if (!this.importExportActive) {
        this.importExportActive = true;
        return;
      }
      const importValue = this.importExport;
      this.importExport = "";
      const fishPattern = /.*f:([\d,]*)(\d)\|*.*/;
      const insectsPattern = /.*i:([\d,]*)(\d)\|*.*/;
      const axeCountPattern = /.*ac:(\d).*/;
      const shovelCountPattern = /.*sc:(\d).*/;
      const balloonCountPattern = /.*bc:(\d).*/;
      const wateringcanCountPattern = /.*wc:(\d).*/;
      let fish = importValue.replace(fishPattern, "$1$2").split(",");
      let insects = importValue.replace(insectsPattern, "$1$2").split(",");
      const axeCount = importValue.replace(axeCountPattern, "$1");
      const shovelCount = importValue.replace(shovelCountPattern, "$1");
      const balloonCount = importValue.replace(balloonCountPattern, "$1");
      const wateringcanCount = importValue.replace(
        wateringcanCountPattern,
        "$1"
      );

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
    }
  },
  computed: {
    showFeedback() {
      return (
        window.location.href == "https://ac-helper.com/" ||
        window.location.href == "http://localhost:8080/"
      );
    },
    ...mapState({ choice: "displayData" })
  }
};
</script>