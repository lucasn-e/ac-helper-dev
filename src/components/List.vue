<template>
  <div class="table-container">
    <div class="data-table">
      <ListItem
        class="header-row"
        :header="true"
        :item="{ captured: 'Captured', name: 'Name', season: 'Season', time: 'Time', location: 'Location', value: 'Value' }"
        @sortByValue="sortByValue"
        @sortByName="sortByName"
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
import Fish from "../data/fish.json";
import Insects from "../data/insects.json";
import { mapState } from "vuex";

export default {
  data() {
    return {
      fish: Fish,
      insects: Insects,
      sorted: "ascending",
      sorting: "name"
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
  mounted() {
    window.fish = Fish;
    window.insects = Insects;
  },
  methods: {
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
    }
  },
  computed: {
    animalType() {
      if (this.displayData === "fish") return this.fish;
      else return this.insects;
    },
    // make sure the JSON doesn't have any html tags (only <p>)
    cleanedData() {
      let clean = JSON.parse(
        JSON.stringify(this.animalType).replace(/<p>|<\/p>/g, "")
      );
      clean = clean.map(elem => {
        return {
          name: elem.name,
          image: elem.image,
          season: elem.season,
          location: elem.location,
          time: elem.time.replace(/(\d\w\w) /, "$1 - "),
          value: elem.value
        };
      });
      let sorted = clean.sort((a, b) => {
        if (this.sorting === "name") {
          return a.name[0] - b.name[0];
        } else if (this.sorting === "value") {
          return a.value - b.value;
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
    ...mapState(["displayData", "sortType", "caught"])
  }
};
</script>