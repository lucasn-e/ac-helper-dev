<template>
  <div v-if="!shouldHide" class="listitem" :class="listItemClass" @click="setCaptured">
    <template v-if="!!header">
      <div class="column head">{{ item.captured }}</div>
    </template>
    <template v-else>
      <div class="column">
        <img :src="getImgUrl(item.image)" class="data-image" :alt="`Image of ${item.name}`" />
        <div :class="caught[displayData].includes(item.name) ? 'x active' : 'x inactive'">X</div>
      </div>
    </template>
    <div class="column namecol" :class="{'head': header}" @click="sortByName">
      <p class="columntext" v-html="item.name">
        <span class="sortingArrow" :class="sorted" v-if="sorting === 'name' && !!header"></span>
      </p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.season }}</p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext" v-html="item.location"></p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.time }}</p>
    </div>
    <div class="column" :class="{'head': header}" @click="sortByValue">
      <p class="columntext" :class="{'value': !header}">
        {{ !header ? sepThousands(item.value) : item.value }}
        <span
          class="sortingArrow"
          :class="sorted === 'ascending' ? 'descending' : 'ascending'"
          v-if="sorting === 'value' && !!header"
        ></span>
      </p>
    </div>
  </div>
</template>
<script>
import store from "../store/index.js";
import { mapState } from "vuex";

export default {
  props: {
    item: {
      type: Object
    },
    header: {
      type: Boolean,
      default: false
    },
    sorting: {
      type: String,
      default: "name"
    },
    sorted: {
      type: String,
      default: "ascending"
    }
  },
  methods: {
    sepThousands(val) {
      if (!val) return;
      let value = val.toString();
      // I'm lazy. sue me
      switch (value.length) {
        case 4:
          return `${value[0]}${this.lang.thousandSeperator}${value[1]}${value[2]}${value[3]}`;
        case 5:
          return `${value[0]}${value[1]}${this.lang.thousandSeperator}${value[2]}${value[3]}${value[4]}`;
        default:
          return val;
      }
    },
    sortByName() {
      if (!this.header) return;
      this.$emit("sortByName");
    },
    sortByValue() {
      if (!this.header) return;
      this.$emit("sortByValue");
    },
    // commit the selected fish or insect to the store and dispatch the action which saves our data to localStorage
    setCaptured() {
      if (!!this.header) return;
      if (this.displayData === "fish") {
        store.commit("storeFish", this.item.name);
      } else {
        store.commit("storeInsect", this.item.name);
      }
      store.dispatch("storeData");
    },
    getImgUrl(img) {
      return require("../assets" + img);
    }
  },
  computed: {
    shouldHide() {
      if (
        !!this.hideCaught &&
        this.caught[this.displayData].includes(this.item.name)
      ) {
        return true;
      } else if (
        !!this.hideUncaught &&
        !this.caught[this.displayData].includes(this.item.name)
      ) {
        return true;
      } else {
        return false;
      }
    },
    listItemClass() {
      let className = "";
      if (this.sortType === "month" && this.header) {
        className = "monthfilter";
      } else if (this.caught[this.displayData].includes(this.item.name)) {
        className = "captured";
      }
      return className;
    },
    sortType() {
      return store.state.sortType;
    },
    ...mapState(["displayData", "caught", "hideCaught", "hideUncaught", "lang"])
  }
};
</script>