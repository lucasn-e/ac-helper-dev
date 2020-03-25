<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr class="month-row">
          <th class="monthname" colspan="6">{{ activeMonthData.month }}</th>
        </tr>
        <tr class="header-row">
          <th>Captured</th>
          <th>Name</th>
          <th>Season</th>
          <th>Location</th>
          <th>Time</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody v-if="payload.sort === 'name'">
        <tr
          v-for="data in sortedData"
          :key="`data-${data.name}`"
          :class="checkCaught(data) ? 'content-row caught' : 'content-row'"
          @click="setCaught(data)"
        >
          <td class="caught">
            <img :src="data.image" class="data-image" />
            <div :class="checkCaught(data) ? 'x active' : 'x inactive'">X</div>
          </td>
          <td>{{ data.name }}</td>
          <td>{{ data.season }}</td>
          <td>{{ data.location }}</td>
          <td>{{ data.time }}</td>
          <td>{{ data.value }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="data in activeMonthData.data"
          :key="`data-${data.name}`"
          :class="checkCaught(data) ? 'content-row caught' : 'content-row'"
          @click="setCaught(data)"
        >
          <td class="caught">
            <img :src="data.image" class="data-image" />
            <div :class="checkCaught(data) ? 'x active' : 'x inactive'">X</div>
          </td>
          <td>{{ data.name }}</td>
          <td>{{ data.season }}</td>
          <td>{{ data.location }}</td>
          <td>{{ data.time }}</td>
          <td>{{ data.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mydata: {
        fishies: localStorage.getItem("myfishies") || "",
        insecties: localStorage.getItem("myinsecties") || ""
      }
    };
  },
  props: {
    payload: {
      type: Object
    }
  },
  methods: {
    checkCaught(val) {
      if (
        this.payload.data === "fish" ||
        localStorage.getItem("last") === "fish"
      ) {
        return this.mydata.fishies.includes(val.name);
      } else {
        return this.mydata.insecties.includes(val.name);
      }
    },
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
    usedData() {
      return localStorage.getItem("last") === "fish"
        ? this.payload.fish
        : this.payload.insects;
    },
    activeMonthData() {
      if (this.payload.sort === "month") {
        const activeData = this.sortedData[this.payload.activeMonth];
        this.$emit("filteredDataCount", activeData.data);
        return activeData;
      } else {
        return [];
      }
    },
    cleanedData() {
      let clean = JSON.parse(
        JSON.stringify(this.usedData).replace(/<p>|<\/p>/g, "")
      );
      return clean.map(elem => {
        const pattern = /<p>|<\/p>/g;
        return {
          name: elem.name.replace(pattern, ""),
          image: elem.image,
          season: elem.season.replace(pattern, ""),
          location: elem.location.replace(pattern, ""),
          time: elem.time.replace(pattern, "").replace(/(\d) /, "$1 "),
          value: elem.value.replace(pattern, "")
        };
      });
    },
    filteredData() {
      const filtered = this.cleanedData.filter(elem =>
        elem.name.toUpperCase().includes(this.payload.filterValue.toUpperCase())
      );

      return filtered;
    },
    sortedData() {
      if (this.payload.sort === "month") {
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
.caught {
  position: relative;
}
.x {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4em;
}
@media screen and (max-width: 767px) {
  .data-image {
    height: 50px;
  }
}
</style>