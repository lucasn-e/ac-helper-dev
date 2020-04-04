<template>
  <div class="stuff">
    <div class="header">
      <h1>Animal Crossing: New Horizon Helper</h1>
    </div>

    <div class="main-content-wrapper">
      <div class="main-content">
        <h3>Choose your topic:</h3>
        <div class="select-container">
          <div
            class="custom-button"
            :class="(!!choice && choice === 'fish') ? 'active' : ''"
            @click="choose('fish')"
          >Fish</div>
          <div
            class="custom-button"
            :class="(!!choice && choice === 'insects') ? 'active' : ''"
            @click="choose('insects')"
          >Insects</div>
          <div
            class="custom-button"
            :class="(!!choice && choice === 'golden-tools') ? 'active' : ''"
            @click="choose('golden-tools')"
          >Golden Tools</div>
        </div>
        <div class="import-export">
          <div class="custom-button mini" @click="handleImport">Import Data</div>
          <div class="custom-button mini" @click="handleExport">Export Data</div>
          <div
            class="error"
            v-if="importError"
          >Error: no import code entered! Please enter your import code in the text field before pressing "Import Data"!</div>
          <div class="error" v-if="exportError">Error: you have no saved data to export!</div>
          <label for="import-export">
            Code:
            <input type="text" id="import-export" name="import-export" v-model="importExport" />
          </label>
        </div>
        <div class="feedback" :class="feedbackOpenClose">
          <div class="fullwidth-container">
            <div class="custom-button mini" @click="toggleFeedback">Feedback</div>
          </div>
          <form class="form" data-netlify="true" method="POST" name="feedback">
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
            <button type="submit" class="custom-button mini">Send</button>
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
import { queryForIndexes, queryByIndex } from "../utils/helper.js";

export default {
  data() {
    return {
      exportError: false,
      importError: false,
      importExport: "",
      feedbackOpenClose: ""
    };
  },
  methods: {
    choose(data) {
      store.commit("assignDisplayData", data);
      store.dispatch("storeSelection");
    },
    toggleFeedback() {
      this.feedbackOpenClose = this.feedbackOpenClose.length > 0 ? "" : "open";
    },
    handleExport() {
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
        axeCount: localStorage.getItem("axeCount") || 0
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
        (counts.axeCount == 0 ? "" : "|ac:" + counts.axeCount);
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
      const importValue = this.importExport;
      this.importExport = "";
      const fishPattern = /.*f:([\d,]*)(\d)\|*.*/;
      const insectsPattern = /.*i:([\d,]*)(\d)\|*.*/;
      const axeCountPattern = /.*ac:(\d).*/;
      const shovelCountPattern = /.*sc:(\d).*/;
      let fish = importValue.replace(fishPattern, "$1$2").split(",");
      let insects = importValue.replace(insectsPattern, "$1$2").split(",");
      const axeCount = importValue.replace(axeCountPattern, "$1");
      const shovelCount = importValue.replace(shovelCountPattern, "$1");

      const caught = {
        fish: queryByIndex(fish, Fish),
        insects: queryByIndex(insects, Insects)
      };

      localStorage.setItem("caught", JSON.stringify(caught));
      localStorage.setItem("axeCount", axeCount);
      localStorage.setItem("shovelCount", shovelCount);
      store.dispatch("getData");
    }
  },
  computed: {
    ...mapState({ choice: "displayData" })
  }
};
</script>