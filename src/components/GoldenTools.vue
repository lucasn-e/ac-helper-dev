<template>
  <div class="tool-container" :class="finished">
    <div class="golden-tool">
      <h3>{{ lang.goldenTools.axe.name }}</h3>
      <p
        v-if="counts.axeCount < 100"
      >{{ lang.goldenTools.axe.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.axe.finished }}</p>
      <ProgressBar :current="parseInt(counts.axeCount)" :max="100" />
      <div class="controls-container">
        <div class="reduce-btn btn" @click="decrement('axeCount')">-</div>
        <label for="broken-axe-count"></label>
        <input
          class="count-input"
          name="broken-axe-count"
          id="broken-axe-count"
          type="text"
          @keyup="handleInput('axeCount', 100)"
          v-model="counts.axeCount"
        />
        <div class="add-btn btn" @click="increment('axeCount', 100)">+</div>
      </div>
    </div>
    <div class="golden-tool">
      <h3>{{ lang.goldenTools.shovel.name }}</h3>
      <p
        v-if="counts.shovelCount < 30"
      >{{ lang.goldenTools.shovel.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.shovel.finished }}</p>
      <ProgressBar :current="parseInt(counts.shovelCount)" :max="30" />
      <div class="controls-container">
        <div class="reduce-btn btn" @click="decrement('shovelCount')">-</div>
        <label for="broken-shovel-count"></label>
        <input
          class="count-input"
          name="broken-shovel-count"
          id="broken-shovel-count"
          type="text"
          @keyup="handleInput('shovelCount', 30)"
          v-model="counts.shovelCount"
        />
        <div class="add-btn btn" @click="increment('shovelCount', 30)">+</div>
      </div>
    </div>

    <div class="golden-tool">
      <h3>{{ lang.goldenTools.wateringCan.name }}</h3>
      <p
        v-if="counts.wateringcanCount < 5"
      >{{ lang.goldenTools.wateringCan.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.wateringCan.finished }}</p>
      <ProgressBar :current="parseInt(counts.wateringcanCount)" :max="5" />
      <div class="controls-container">
        <div class="reduce-btn btn" @click="decrement('wateringcanCount')">-</div>
        <label for="broken-shovel-count"></label>
        <input
          class="count-input"
          name="wateringcanCount-count"
          id="wateringcanCount-count"
          type="text"
          @keyup="handleInput('wateringcanCount', 5)"
          v-model="counts.wateringcanCount"
        />
        <div class="add-btn btn" @click="increment('wateringcanCount', 5)">+</div>
      </div>
    </div>

    <div class="golden-tool">
      <h3>{{ lang.goldenTools.slingshot.name }}</h3>
      <p
        v-if="counts.balloonCount < 300"
      >{{ lang.goldenTools.slingshot.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.slingshot.finished }}</p>
      <ProgressBar :current="parseInt(counts.balloonCount)" :max="300" />
      <div class="controls-container">
        <div class="reduce-btn btn" @click="decrement('balloonCount')">-</div>
        <label for="balloon-count"></label>
        <input
          class="count-input"
          name="balloon-count"
          id="balloon-count"
          type="text"
          @keyup="handleInput('balloonCount', 300)"
          v-model="counts.balloonCount"
        />
        <div class="add-btn btn" @click="increment('balloonCount', 300)">+</div>
      </div>
    </div>

    <div class="golden-tool">
      <h3>{{ lang.goldenTools.fishingRod.name }}</h3>
      <p
        v-if="caught.fish.length < 80"
      >{{ lang.goldenTools.fishingRod.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.fishingRod.finished }}</p>
      <ProgressBar :current="caught.fish.length" :max="80" />
      <div class="controls-container">{{ caught.fish.length }} / 80</div>
    </div>
    <div class="golden-tool">
      <h3>{{ lang.goldenTools.bugNet.name }}</h3>
      <p
        v-if="caught.insects.length < 80"
      >{{ lang.goldenTools.bugNet.unfinished }} {{ lang.global.trackProgress }}</p>
      <p v-else>{{ lang.goldenTools.bugNet.finished }}</p>
      <ProgressBar :current="caught.insects.length" :max="80" />
      <div class="controls-container">{{ caught.insects.length }} / 80</div>
    </div>
    <div v-if="finished" class="button-container">
      <div class="custom-button" @click="reset">{{ lang.goldenTools.reset }}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ProgressBar from "./ProgressBar.vue";

export default {
  data() {
    return {
      counts: {
        ["axeCount"]: localStorage.getItem("axeCount") || 0,
        ["shovelCount"]: localStorage.getItem("shovelCount") || 0,
        ["balloonCount"]: localStorage.getItem("balloonCount") || 0,
        ["wateringcanCount"]: localStorage.getItem("wateringcanCount") || 0
      }
    };
  },
  components: {
    ProgressBar
  },
  computed: {
    finished() {
      return this.caught.insects.length == 80 &&
        this.caught.fish.length == 80 &&
        this.counts.axeCount == 100 &&
        this.counts.shovelCount == 30
        ? "finished"
        : "";
    },
    ...mapState(["caught", "lang"])
  },
  mounted() {
    if (
      this.caught.insects.length == 80 &&
      this.caught.fish.length == 80 &&
      this.counts.axeCount == 100 &&
      this.counts.shovelCount == 30
    ) {
      this.$emit("finished", true);
    }
  },
  methods: {
    reset() {
      this.counts.axeCount = 0;
      this.counts.shovelCount = 0;
      localStorage.setItem("shovelCount", 0);
      localStorage.setItem("axeCount", 0);
      this.$emit("finished", false);
    },
    // make sure to remove all non-numbers, not to overshoot the max not to go negative
    handleInput(value, max) {
      if (/[a-z]/.test(this.counts[value])) {
        // convert to string so we can s/regexp/replace
        this.counts[value] = this.counts[value]
          .toString()
          .replace(/[a-z]/g, "");
        // if, after the removal of the non-number character the value is not a number, turn it into a 0
        this.counts[value] = isNaN(parseInt(this.counts[value]))
          ? 0
          : parseInt(this.counts[value]);
        // prevent overshoot
      } else if (this.counts[value] > max) {
        this.counts[value] = max;
        // prevent negative
      } else if (this.counts[value] < 0) {
        this.counts[value] = 0;
      }
      // store to localstorage
      localStorage.setItem(value, this.counts[value]);
    },
    increment(stuff, max) {
      // make sure not to overshoot the max and increment by 1 otherwise
      if (this.counts[stuff] === max) return;
      this.counts[stuff] = parseInt(this.counts[stuff]) + 1;
      localStorage.setItem(stuff, this.counts[stuff]);
    },
    decrement(stuff) {
      // make sure not to go negative and increment by 1 otherwise
      if (this.counts[stuff] === 0) return;
      this.counts[stuff] = parseInt(this.counts[stuff]) - 1;
      localStorage.setItem(stuff, this.counts[stuff]);
    }
  }
};
</script>