<template>
  <div class="tool-container">
    <div class="golden-tool">
      <h3>Golden Axe</h3>
      <p>Break 100 axes of any kind to unlock. Track your status!</p>
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
      <p>Save Gulliver 30 times to receive the DIY recipe! Track your status!</p>
      <div class="controls-container">
        <div class="reduce-btn btn" @click="decrement('shovelCount')">-</div>
        <label for="broken-axe-count"></label>
        <input
          class="count-input"
          name="broken-axe-count"
          id="broken-axe-count"
          type="text"
          @keyup="handleInput('shovelCount', 30)"
          v-model="counts.shovelCount"
        />
        <div class="add-btn btn" @click="increment('shovelCount', 30)">+</div>
      </div>
    </div>
    <div class="golden-tool">
      <h3>Golden Fishing Rod</h3>
      <p>Catch all Fish! Track your status!</p>
      <div class="controls-container">{{ caught.fish.length }} / 80</div>
    </div>
    <div class="golden-tool">
      <h3>Golden Bug Net</h3>
      <p>Catch all Bugs! Track your status!</p>
      <div class="controls-container">{{ caught.insects.length }} / 80</div>
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
    ...mapState(["caught"])
  },
  methods: {
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
<style scoped>
.golden-tool {
  padding: 25px;
  width: 60%;
  background-color: #ffe46a;
  border-radius: 22px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.5);
  margin-bottom: 35px;
}
.tool-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.controls-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.btn {
  padding: 10px;
  width: 19px;
  background-color: #c4161c;
  color: #ffe46a;
  font-weight: 800;
  cursor: pointer;
  user-select: none;
}
.count-input {
  text-align: center;
  font-size: 1.1em;
  width: 100px;
}
</style>