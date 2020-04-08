<template>
  <div class="display-container">
    <div class="menu" id="waypoint1" v-if="!!displayData">
      <h3 v-if="!finished">{{ title }} {{ lang.global.guide }}</h3>
      <template v-if="displayData != 'golden-tools'">
        <div class="filter">
          <label for="search">{{ lang.sorting.search }}&nbsp;</label>
          <input name="search" id="search" type="text" class="filter-input" v-model="filterValue" />
          <div
            class="result-count"
            v-if="filterValue.length > 0"
          >{{ count.length }} {{ lang.sorting.results }}</div>
        </div>
        <div class="sortby" v-if="displayData != 'songs'">
          {{ lang.sorting.sort }}
          <div
            class="mini-button"
            @click="sortby('month')"
            :class="sortType === 'month' ? 'active' : ''"
          >{{ lang.sorting.month }}</div>
          <div
            class="mini-button"
            @click="sortby('name')"
            :class="sortType !== 'month' ? 'active' : ''"
          >{{ lang.global.name }}</div>
        </div>
        <div v-if="sortType === 'month'" class="jumpto-bar">
          {{ lang.sorting.displayFor }}
          <div
            v-for="(month, index) in months"
            :key="month"
            @click="setActiveMonth(index)"
            :class="activeMonth == index ? 'jumpto-link active' : 'jumpto-link'"
          >{{ month }}</div>
        </div>
        <div class="hide-caught-uncaught-container">
          <div class="custom-button large" @click="toggleHideCaught">
            <div v-if="!hideCaught">{{ lang.sorting.hide.caught }}</div>
            <div v-else>{{ lang.sorting.show.caught }}</div>
          </div>
          <div class="custom-button large" @click="toggleHideUncaught">
            <div v-if="!hideUncaught">{{ lang.sorting.hide.uncaught }}</div>
            <div v-else>{{ lang.sorting.show.uncaught }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="!!finished">{{ lang.congrats }}</template>
      </template>
    </div>
    <List
      :payload="payload"
      @filteredDataCount="displayCount"
      v-if="displayData != 'golden-tools'"
    />
    <GoldenTools v-else @finished="handleFinished" />
  </div>
</template>
<script>
import List from "./List.vue";
import GoldenTools from "./GoldenTools.vue";
import store from "../store/index.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      filterValue: "",
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
      activeMonth: 0,
      count: 0,
      finished: false
    };
  },
  components: {
    List,
    GoldenTools
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  computed: {
    title() {
      switch (this.displayData) {
        case "fish":
          return this.lang.global.fish;
        case "insects":
          return this.lang.global.insects;
        case "songs":
          return this.lang.global.songs;
        default:
          return this.lang.header.goldenTools;
      }
    },
    payload() {
      return {
        filterValue: this.filterValue,
        activeMonth: this.activeMonth,
        months: this.months
      };
    },
    ...mapState([
      "sortType",
      "displayData",
      "hideCaught",
      "hideUncaught",
      "lang"
    ])
  },
  methods: {
    toggleHideCaught() {
      store.commit("toggleHideCaught");
    },
    toggleHideUncaught() {
      store.commit("toggleHideUncaught");
    },
    handleFinished(value) {
      this.finished = value;
    },
    displayCount(value) {
      this.count = value;
    },
    sortby(value) {
      store.commit("assignSortType", value);
      store.dispatch("storeSelection");
    },
    setActiveMonth(month) {
      this.activeMonth = month;
    }
  }
};
</script>