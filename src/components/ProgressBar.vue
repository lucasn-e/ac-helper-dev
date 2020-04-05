<template>
  <div class="progress-bar-container">
    <div class="progress-bar-background" :style="`background-color:${backgroundColor}`"></div>
    <div class="progress-bar-current" :style="`width:${percentage}%; background-color:${barcolor}`"></div>
    <div class="progress-bar-text" :style="`color:${textcolor}`">{{ percentage }}%</div>
  </div>
</template>
<script>
import { mobileCheck } from "../utils/helper.js";
const isMobile = mobileCheck();

export default {
  data() {
    return {};
  },
  props: {
    current: {
      type: Number
    },
    max: {
      type: Number
    },
    backgroundColor: {
      type: String,
      default: "#fff"
    },
    textColor: {
      type: String,
      default: "#fff"
    },
    barColor: {
      type: String,
      default: "#a7cffc"
    },
    successColor: {
      type: String,
      default: "#a1de93"
    }
  },
  computed: {
    percentage() {
      return Math.floor((parseInt(this.current) / parseInt(this.max)) * 100);
    },
    barcolor() {
      return parseInt(this.current) === parseInt(this.max)
        ? this.successColor
        : this.barColor;
    },
    textcolor() {
      if (!isMobile)
        return parseInt(this.percentage) >= 52 ? this.textColor : "#222";
      else return parseInt(this.percentage) >= 57 ? this.textColor : "#222";
    }
  }
};
</script>
<style scoped>
.progress-bar-container {
  position: relative;
  min-width: 200px;
  height: 50px;
  margin: 15px 0;
}
.progress-bar-background {
  width: 100%;
}
.progress-bar-background,
.progress-bar-current {
  position: absolute;
  height: 100%;
}
.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>