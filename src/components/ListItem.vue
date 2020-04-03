<template>
  <div class="listitem" :class="listItemClass" @click="setCaptured">
    <template v-if="!!header">
      <div class="column head">{{ item.captured }}</div>
    </template>
    <template v-else>
      <div class="column">
        <img :src="item.image" class="data-image" :alt="`Image of ${item.name}`" />
        <div :class="isCaptured ? 'x active' : 'x inactive'">X</div>
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

export default {
  props: {
    item: {
      type: Object
    },
    header: {
      type: Boolean
    },
    animalType: {
      type: String
    }
  },
  methods: {
    setCaptured() {
      if (this.animalType === "fish") {
        store.commit("storeFish", this.item.name);
      } else {
        store.commit("storeInsect", this.item.name);
      }
      store.dispatch("storeData");
    }
  },
  computed: {
    storedFish() {
      return store.state.fish;
    },
    storedInsects() {
      return store.state.insects;
    },
    listItemClass() {
      let className;
      if (this.sortType === "month" && this.header) {
        className = "monthfilter";
      } else if (this.isCaptured) {
        className = "captured";
      }
      return className;
    },
    sortType() {
      return store.state.sortType;
    },
    isCaptured() {
      if (this.animalType === "fish") {
        return store.state.fish.includes(this.item.name);
      } else {
        return store.state.insects.includes(this.item.name);
      }
    }
  }
};
</script>
<style scoped>
.listitem {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 100px;
  justify-content: space-around;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  cursor: pointer;
}
.columntext {
  cursor: initial;
  pointer-events: none;
}
.listitem.captured {
  background-color: #a2dea2;
  border-top: 1px solid #888;
  border-bottom: 1px solid #888;
}
.column {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100px;
}
.listitem.header-row {
  position: sticky;
  top: 0;
  z-index: 1;
}
@media screen and (min-width: 768px) {
  .listitem.header-row.monthfilter {
    top: 75px;
  }
}
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
  .column {
    width: 75px;
    font-size: 0.8em;
  }
}
</style>