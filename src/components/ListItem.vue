<template>
  <div class="listitem" :class="listItemClass" @click="setCaptured">
    <template v-if="!!header">
      <div class="column head">{{ item.captured }}</div>
    </template>
    <template v-else>
      <div class="column">
        <img :src="item.image" class="data-image" :alt="`Image of ${item.name}`" />
        <div :class="caught[displayData].includes(item.name) ? 'x active' : 'x inactive'">X</div>
      </div>
    </template>
    <div class="column namecol" :class="{'head': header}">
      <p class="columntext">{{ item.name }}</p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.season }}</p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.location }}</p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.time }}</p>
    </div>
    <div class="column" :class="{'head': header}">
      <p class="columntext">{{ item.value }}</p>
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
    }
  },
  methods: {
    // commit the selected fish or insect to the store and dispatch the action which saves our data to localStorage
    setCaptured() {
      if (!!this.header) return;
      if (this.displayData === "fish") {
        store.commit("storeFish", this.item.name);
      } else {
        store.commit("storeInsect", this.item.name);
      }
      store.dispatch("storeData");
    }
  },
  computed: {
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
    ...mapState(["displayData", "caught"])
  }
};
</script>