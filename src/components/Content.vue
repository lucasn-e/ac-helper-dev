<template>
  <div class="display-container">
    <div class="menu" id="waypoint1" v-if="!!displayData">
      <h3 v-if="!finished">{{ displayData | capitalize }} Guide</h3>
      <template v-if="displayData != 'golden-tools'">
        <div class="filter">
          <label for="search">Search:&nbsp;</label>
          <input name="search" id="search" type="text" class="filter-input" v-model="filterValue" />
          <div class="result-count" v-if="filterValue.length > 0">{{ count }} Results</div>
        </div>
        <div class="sortby">
          Sort by:
          <div
            class="mini-button"
            @click="sortby('month')"
            :class="sortType === 'month' ? 'active' : ''"
          >Month</div>
          <div
            class="mini-button"
            @click="sortby('name')"
            :class="sortType !== 'month' ? 'active' : ''"
          >Name</div>
        </div>
        <div v-if="sortType === 'month'" class="jumpto-bar">
          Display data for:
          <div
            v-for="(month, index) in months"
            :key="month"
            @click="setActiveMonth(index)"
            :class="activeMonth == index ? 'jumpto-link active' : 'jumpto-link'"
          >{{ month }}</div>
        </div>
      </template>
      <template v-else>
        <template v-if="!!finished">CONGRATULATIONS!</template>
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
    payload() {
      return {
        filterValue: this.filterValue,
        activeMonth: this.activeMonth,
        months: this.months
      };
    },
    ...mapState(["sortType", "displayData"])
  },
  methods: {
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