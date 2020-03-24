<template>
  <div class="display-container">
    <div class="menu" v-if="!!data || !!last">
      <h3>{{ data || last | capitalize }} Guide</h3>
      <div class="filter">
        Search:
        <input type="text" class="filter-input" v-model="filterValue" />
        <div class="result-count" v-if="filterValue.length > 0">{{ count }} Results</div>
      </div>
      <div class="sortby">
        Sort by:
        <div
          class="mini-button"
          @click="sortby('month')"
          :class="sort === 'month' ? 'active' : ''"
        >Month</div>
        <div
          class="mini-button"
          @click="sortby('name')"
          :class="sort !== 'month' ? 'active' : ''"
        >Name</div>
      </div>
      <div v-if="sort === 'month'" class="jumpto-bar">
        Display data for:
        <div
          v-for="(month, index) in months"
          :key="month"
          @click="setActiveMonth(index)"
          :class="activeMonth == index ? 'jumpto-link active' : 'jumpto-link'"
        >{{ month }}</div>
      </div>
    </div>
    <List :payload="payload" @filteredDataCount="displayCount" />
  </div>
</template>
<script>
import List from "./List.vue";
import Fish from "../data/fish.json";
import Insects from "../data/insects.json";

export default {
  data() {
    return {
      filterValue: "",
      sort: "month",
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
      fish: Fish,
      activeMonth: 0,
      last: localStorage.getItem("last") || "",
      count: 0
    };
  },
  components: {
    List
  },
  props: {
    data: {
      type: String
    }
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
        data: this.data,
        fish: Fish,
        insects: Insects,
        activeMonth: this.activeMonth,
        last: localStorage.getItem("last") || "",
        sort: this.sort,
        months: this.months
      };
    }
  },
  methods: {
    displayCount(value) {
      console.log(value);
      this.count = value.length;
    },
    sortby(value) {
      this.sort = value;
    },
    setActiveMonth(month) {
      this.activeMonth = month;
    }
  }
};
</script>
<style>
.display-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.table-container {
  min-width: 100%;
  display: flex;
  justify-content: center;
}
.data-table {
  min-width: 55%;
}
.menu {
  width: auto;
  padding: 25px;
  margin: 27px 0;
  border: 1px solid #222;
  border-radius: 22px;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.5);
}
tr {
  height: 35px;
}
.header-row {
  background-color: #ffe46a;
  color: #c4161c;
}
.content-row {
  transition: 0.25s;
}
.content-row:nth-child(even) {
  background-color: #dcdcdc;
}
.content-row.caught {
  background-color: #b5ff9e;
}

.sortby {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 15px 0;
}
.mini-button {
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
}
.mini-button:hover {
  color: #c4161c;
}
.month-row {
  margin-top: 15px;
}
.monthname {
  height: 100px;
  background-color: #c5a5b8;
  font-size: 2em;
}
.active {
  color: #c4161c;
}
.jumpto-bar {
  position: fixed;
  height: 75px;
  filter: drop-shadow(0 0 0.75rem #000);
  background-color: #fff;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.jumpto-link {
  padding: 20px;
  margin: 0 5px;
  transition: 0.125s;
  cursor: pointer;
  user-select: none;
}
.jumpto-link.active {
  background-color: #c4161c;
  color: #fff;
}
.jumpto-link:hover {
  background-color: #c4161c;
  color: #fff;
}
.caught {
  cursor: pointer;
}
.x {
  transition: 0.25s;
}
.active {
  opacity: 1;
}
.inactive {
  opacity: 0;
}
.filter-input {
  border: 1px solid #222;
  padding: 5px;
}

@media screen and (max-width: 767px) {
  .jumpto-bar {
    position: initial;
    flex-wrap: wrap;
    height: auto;
    filter: none;
  }
  td,
  th {
    font-size: 0.8em;
  }
  .table-container {
    min-width: 55%;
    max-width: 100%;
  }
  .menu {
    border: none;
    border-radius: 0;
  }
}
</style>