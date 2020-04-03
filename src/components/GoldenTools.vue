<template>
  <div class="tool-container" :class="finished">
    <div class="golden-tool">
      <h3>Golden Axe</h3>
      <p v-if="counts.axeCount < 100">Break 100 axes of any kind to unlock. Track your status!</p>
      <p v-else>Congrats on breaking 100 axes and unlocking the golden axe!</p>
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
      <h3>Golden Shovel</h3>
      <p
        v-if="counts.shovelCount < 30"
      >Save Gulliver 30 times to receive the DIY recipe! Track your status!</p>
      <p v-else>Congrats on saving Gulliver 30 times and receiving the golden shovel!</p>
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
      <h3>Golden Fishing Rod</h3>
      <p v-if="caught.fish.length < 80">Catch all Fish! Track your status!</p>
      <p v-else>Congrats on catching all the fish!</p>
      <div class="controls-container">{{ caught.fish.length }} / 80</div>
    </div>
    <div class="golden-tool">
      <h3>Golden Bug Net</h3>
      <p v-if="caught.insects.length < 80">Catch all Bugs! Track your status!</p>
      <p v-else>Congrats on catching all bugs!</p>
      <div class="controls-container">{{ caught.insects.length }} / 80</div>
    </div>
    <div v-if="finished" class="button-container">
      <div class="custom-button" @click="reset">Reset</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      counts: {
        ["axeCount"]: localStorage.getItem("axeCount") || 0,
        ["shovelCount"]: localStorage.getItem("shovelCount") || 0
      }
    };
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
    ...mapState(["caught"])
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
    handleInput(value, max) {
      if (/[a-z]/.test(this.counts[value])) {
        this.counts[value] = this.counts[value]
          .toString()
          .replace(/[a-z]/g, "");
        this.counts[value] = isNaN(parseInt(this.counts[value]))
          ? 0
          : parseInt(this.counts[value]);
      } else if (this.counts[value] > max) {
        this.counts[value] = max;
      } else if (this.counts[value] < 0) {
        this.counts[value] = 0;
      }
      localStorage.setItem(value, this.counts[value]);
    },
    increment(stuff, max) {
      if (this.counts[stuff] === max) return;
      this.counts[stuff] = this.counts[stuff] + 1;
      localStorage.setItem(stuff, this.counts[stuff]);
    },
    decrement(stuff) {
      if (this.counts[stuff] === 0) return;
      this.counts[stuff] = this.counts[stuff] - 1;
      localStorage.setItem(stuff, this.counts[stuff]);
    }
  }
};
</script>