<template>
  <div class="table-container">
    <div class="data-table">
      <ListItem
        class="header-row"
        :header="true"
        :item="{ captured: lang.listHeader.caught, name: lang.global.name, season: lang.listHeader.season, time: lang.listHeader.time, location: lang.listHeader.location, value: lang.listHeader.value }"
        @sortByValue="sortByValue"
        @sortByName="sortByName"
        @sortyByID="sortyByID"
        :sorting="sorting"
        :sorted="sorted"
      />
      <ListItem
        class="content-row"
        v-for="data in sortType === 'name' ? sortedData : activeMonthData.data"
        :key="data.name"
        :item="data"
      />
    </div>
  </div>
</template>
<script>
import ListItem from "./ListItem.vue";
import { mapState } from "vuex";
import { toggleHemisphere } from "../utils/helper.js";

export default {
  data() {
    return {
      sorted: "ascending",
      sorting: "name",
      current: "NH",
      newFish: [],
      newInsects: []
    };
  },
  components: {
    ListItem
  },
  props: {
    payload: {
      type: Object
    }
  },
  methods: {
    sortyByID() {
      if (this.sorting === "ID") {
        this.sorted = this.sorted === "ascending" ? "descending" : "ascending";
      } else {
        this.sorting = "ID";
      }
    },
    sortByValue() {
      if (this.sorting === "value") {
        this.sorted = this.sorted === "ascending" ? "descending" : "ascending";
      } else {
        this.sorting = "value";
      }
    },
    sortByName() {
      if (this.sorting === "name") {
        this.sorted = this.sorted === "ascending" ? "descending" : "ascending";
      } else {
        this.sorting = "name";
      }
    },
    swapNhSh() {
      let temp = this.fish;
      let temp2 = this.insects;
      temp = toggleHemisphere(temp);
      temp2 = toggleHemisphere(temp2);
      this.newFish = temp;
      this.newInsects = temp2;
    }
  },
  mounted() {
    this.newFish = this.fish;
    this.newInsects = this.insects;
    if (this.loc != this.current) {
      this.swapNhSh();
      this.current = this.loc;
    }
  },
  watch: {
    fish() {
      if (this.loc != this.current) {
        this.swapNhSh();
      } else {
        this.newFish = this.fish;
        this.newInsects = this.insects;
      }
    },
    loc() {
      if (this.loc != this.current) {
        this.swapNhSh();
        this.current = this.loc;
      }
    }
  },
  computed: {
    animalType() {
      if (this.displayData === "fish") return this.newFish;
      else return this.newInsects;
    },
    cleanedData() {
      let clean = this.animalType.map(elem => {
        let seasons = elem.season;
        this.payload.months.some((month, index) => {
          if (seasons.includes("All")) return true;
          if (!/\d/.test(seasons)) return true;
          seasons = seasons.replace(/10/, this.payload.months[10]);
          seasons = seasons.replace(/11/, this.payload.months[11]);
          seasons = seasons.replace(index, month);
        });
        return { ...elem, season: seasons };
      });
      let sorted = clean.sort((a, b) => {
        switch (this.sorting) {
          case "name":
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          case "value":
            return a.value - b.value;
          case "ID":
            return a.index - b.index;
        }
      });
      if (this.sorted === "ascending") {
        return sorted;
      } else {
        return sorted.reverse();
      }
    },
    // return array consisting only of elements that match the "Search" <input>
    filteredData() {
      return this.cleanedData.filter(elem =>
        elem.name.toUpperCase().includes(this.payload.filterValue.toUpperCase())
      );
    },
    // sort data by month or do nothing
    sortedData() {
      if (this.sortType === "month") {
        // create new array [{ month: STRING, data: ARRAY }] each object represents a month and the corresponding elements
        const filtered = this.payload.months.map((element, i) => {
          return {
            month: element,
            data: this.filteredData.filter(elem => {
              const current = i;
              let from, to;
              let myData = { ...elem };
              /*
               * elem.season is a string containing either: the name of a single month, "All Year" or a range of months
               * if it's a range of months, we want to split them into an array in order to more efficiently sort elements by them
               */
              const filterValue = /-/.test(elem.season)
                ? elem.season.split("-")
                : elem.season;
              // arrays are objects in javascript because life is beautiful
              if (typeof filterValue === "object") {
                // [].prototype.some() breaks out of the loop if the return value is true
                this.payload.months.some((month, index) => {
                  // save the index of the month if the month name is the same as the month range starting point
                  if (filterValue[0].includes(month)) {
                    from = index;
                    return true;
                  }
                });
                this.payload.months.some((month, index) => {
                  // save the index of the month if the month name is the same as the month range end
                  if (filterValue[1].includes(month)) {
                    to = index;
                    return true;
                  }
                });
                let returnThis = elem.season.includes(
                  this.payload.months[current]
                );
                if (returnThis) return myData;
                // in case of a month range spreading over the end of a year (Nov - Feb for example) and the selected month falls in between
                if (from >= current && to >= current && to < from) {
                  return myData;
                  // if the selected month falls in between the range
                } else if (current >= from && current <= to) {
                  return myData;
                }
                // if the element can be found in either the selected month or all year round
              } else if (filterValue === "All Year" || filterValue == element) {
                return myData;
              }
            })
          };
        });
        return filtered;
      } else {
        // emit the amount of items that remain after the "Search" <input> filter was applied into any component that imports this one
        this.$emit("filteredDataCount", this.filteredData.length);
        return this.filteredData;
      }
    },
    // return the data corresponding to the user selected month
    activeMonthData() {
      if (this.sortType === "month") {
        const activeData = this.sortedData[this.payload.activeMonth];
        this.$emit("filteredDataCount", activeData.data);
        return activeData;
      } else {
        return [];
      }
    },
    ...mapState([
      "displayData",
      "sortType",
      "caught",
      "loc",
      "lang",
      "fish",
      "insects"
    ])
  }
};
</script>