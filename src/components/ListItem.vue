<template>
  <div>
    <template v-if="displayData != 'songs'">
      <div v-if="!shouldHide" class="listitem" :class="listItemClass" @click="setCaptured">
        <template v-if="!!header">
          <div class="column head half" v-if="!mobile" @click="sortByID">
            <p class="columntext">ID</p>
          </div>
          <div class="column head">{{ item.captured }}</div>
        </template>
        <template v-else>
          <div class="column half" v-if="!mobile">
            <p class="columntext">{{ item.index }}</p>
          </div>
          <div class="column">
            <img :src="getImgUrl(item.image)" class="data-image" :alt="`Image of ${item.name}`" />
            <div :class="caught[displayData].includes(item.name) ? 'x active' : 'x inactive'">X</div>
          </div>
        </template>
        <div class="column namecol" :class="{'head': header}" @click="sortByName">
          <p class="columntext" v-html="item.name"></p>
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
          <p class="columntext" v-if="header">{{ item.value }}</p>
          <p v-else class="columntext value">{{ sepThousands(item.value) }}</p>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="!shouldHide" class="listitem" :class="listItemClass" @click="setCaptured">
        <template v-if="!!header">
          <div class="column head songscol">{{ lang.listHeader.bought }}</div>
        </template>
        <template v-else>
          <div class="column songscol">
            <img :src="item.image" class="data-image song-image" :alt="`Image of ${item.name}`" />
            <div :class="caught[displayData].includes(item.name) ? 'x active' : 'x inactive'">X</div>
          </div>
        </template>
        <div class="column namecol songscol" :class="{'head': header}" @click="sortByName">
          <p class="columntext" v-html="item.name"></p>
        </div>
        <div class="column songscol" :class="{'head': header}" @click="sortByName">
          <p class="columntext" v-html="item.location"></p>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import store from "../store/index.js";
import { mapState } from "vuex";
import { mobileCheck } from "../utils/helper.js";

export default {
  data() {
    return {
      mobile: false
    };
  },
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
  mounted() {
    this.mobile = mobileCheck();
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
    sortByID() {
      if (!this.header) return;
      this.$emit("sortyByID");
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

      switch (this.displayData) {
        case "fish":
          store.commit("storeFish", this.item.name);
          break;
        case "insects":
          store.commit("storeInsects", this.item.name);
          break;
        case "songs":
          store.commit("storeSongs", this.item.name);
          break;
        default:
          return;
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