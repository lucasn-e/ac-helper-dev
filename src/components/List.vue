<template>
  <div class="table-container">
    <div class="data-table">
      <div v-if="sortType === 'month'" class="month-row">
        <div class="monthname">
          <p>{{ activeMonthData.month }}</p>
        </div>
      </div>
      <ListItem
        class="header-row"
        :header="true"
        :item="{ captured: 'Captured', name: 'Name', season: 'Season', time: 'Time', location: 'Location', value: 'Value' }"
      />
      <template v-if="sortType === 'name'">
        <ListItem
          class="content-row"
          v-for="data in sortedData"
          :key="data.name"
          :header="false"
          :item="data"
        />
      </template>
      <template v-else>
        <ListItem
          class="content-row"
          v-for="data in activeMonthData.data"
          :key="data.name"
          :animalType="animalType"
          :header="false"
          :item="data"
        />
      </template>
    </div>
  </div>
</template>
<script>
import ListItem from "./ListItem.vue";
import store from "../store/index.js";
import Fish from "../data/fish.json";
import Insects from "../data/insects.json";

export default {
  data() {
    return {
      mydata: {
        fishies: localStorage.getItem("myfishies") || "",
        insecties: localStorage.getItem("myinsecties") || ""
      }
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
    setCaught(val) {
      const last =
        localStorage.getItem("last") === "fish" ? "myfishies" : "myinsecties";
      let data = localStorage.getItem(last) || "";

      if (data.includes(val.name)) {
        data = data.replace(val.name, "");
      } else {
        data = data + val.name;
      }
      if (last === "myfishies") {
        this.mydata.fishies = data;
      } else {
        this.mydata.insecties = data;
      }

      localStorage.setItem(last, data);
    }
  },
  computed: {
    sortType() {
      return store.state.sortType;
    },
    animalType() {
      return store.state.displayData;
    },
    displayData() {
      if (this.animalType === "fish") return Fish;
      else return Insects;
    },
    activeMonthData() {
      if (this.sortType === "month") {
        const activeData = this.sortedData[this.payload.activeMonth];
        this.$emit("filteredDataCount", activeData.data);
        return activeData;
      } else {
        return [];
      }
    },
    cleanedData() {
      let clean = JSON.parse(
        JSON.stringify(this.displayData).replace(/<p>|<\/p>/g, "")
      );
      return clean.map(elem => {
        return {
          name: elem.name,
          image: elem.image,
          season: elem.season,
          location: elem.location,
          time: elem.time.replace(/(\d) /, "$1 "),
          value: elem.value
        };
      });
    },
    filteredData() {
      return this.cleanedData.filter(elem =>
        elem.name.toUpperCase().includes(this.payload.filterValue.toUpperCase())
      );
    },
    sortedData() {
      if (this.sortType === "month") {
        const filtered = this.payload.months.map((element, i) => {
          return {
            month: element,
            data: this.filteredData.filter(elem => {
              const current = i;
              let from, to;
              let myData = { ...elem };
              const filterValue = /-/.test(elem.season)
                ? elem.season.split("-")
                : elem.season;
              if (typeof filterValue === "object") {
                this.payload.months.some((month, index) => {
                  if (filterValue[0].includes(month)) {
                    from = index;
                    return true;
                  }
                });
                this.payload.months.some((month, index) => {
                  if (filterValue[1].includes(month)) {
                    to = index;
                    return true;
                  }
                });
                if (from >= current && to >= current && to < from) {
                  return myData;
                } else if (current >= from && current <= to) {
                  return myData;
                }
              } else if (filterValue === "All Year" || filterValue == element) {
                return myData;
              }
            })
          };
        });
        return filtered;
      } else {
        this.$emit("filteredDataCount", this.filteredData);
        return this.filteredData;
      }
    }
  }
};
</script>
<style scoped>
.monthname {
  height: 100px;
  background-color: #c5a5b8;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>