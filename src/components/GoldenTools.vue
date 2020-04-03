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
<style scoped>
.button-container {
  margin-top: 95px;
}
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
.tool-container.finished {
  position: absolute;
  top: 0;
}
.tool-container.finished .golden-tool:nth-child(1) {
  z-index: 5;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: rotateZ(0deg) translateX(-50%);
  animation: leftthrow 0.5s forwards;
  animation-delay: 0s;
}
.tool-container.finished .golden-tool:nth-child(2) {
  z-index: 4;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: rotateZ(0deg) translateX(-50%);
  animation: leftthrow 0.5s forwards;
  animation-delay: 1s;
}
.tool-container.finished .golden-tool:nth-child(3) {
  z-index: 3;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: rotateZ(0deg) translateX(-50%);
  animation: leftthrow 0.5s forwards;
  animation-delay: 2s;
}
.tool-container.finished .golden-tool:nth-child(4) {
  z-index: 2;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: rotateZ(0deg) translateX(-50%);
  animation: leftthrow 0.5s forwards;
  animation-delay: 3s;
}
@keyframes leftthrow {
  0% {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: rotateZ(0deg) translateX(-50%);
  }
  5% {
    position: absolute;
    top: -50px;
    left: 45%;
    transform: rotateZ(-2.5deg) translateX(-55%);
  }
  10% {
    position: absolute;
    top: -100px;
    left: 40%;
    transform: rotateZ(-5deg) translateX(-60%);
  }
  15% {
    position: absolute;
    top: -150px;
    left: 35%;
    transform: rotateZ(-10deg) translateX(-65%);
  }
  20% {
    position: absolute;
    top: -200px;
    left: 30%;
    transform: rotateZ(-15deg) translateX(-70%);
  }
  25% {
    position: absolute;
    top: -250px;
    left: 25%;
    transform: rotateZ(-25deg) translateX(-75%);
  }
  30% {
    position: absolute;
    top: -300px;
    left: 20%;
    transform: rotateZ(-30deg) translateX(-80%);
  }
  35% {
    position: absolute;
    top: -350px;
    left: 15%;
    transform: rotateZ(-35deg) translateX(-85%);
  }
  40% {
    position: absolute;
    top: -400px;
    left: 10%;
    transform: rotateZ(-40deg) translateX(-90%);
  }
  45% {
    position: absolute;
    top: -450px;
    left: 5%;
    transform: rotateZ(-45deg) translateX(-95%);
  }
  50% {
    position: absolute;
    top: -500px;
    left: 0%;
    transform: rotateZ(-50deg) translateX(-100%);
  }
  55% {
    position: absolute;
    top: -550px;
    left: -10%;
    transform: rotateZ(-55deg) translateX(-110%);
  }
  60% {
    position: absolute;
    top: -600px;
    left: -20%;
    transform: rotateZ(-60deg) translateX(-120%);
  }
  65% {
    position: absolute;
    top: -650px;
    left: -30%;
    transform: rotateZ(-65deg) translateX(-130%);
  }
  70% {
    position: absolute;
    top: -700px;
    left: -40%;
    transform: rotateZ(-70deg) translateX(-140%);
  }
  75% {
    position: absolute;
    top: -750px;
    left: -40%;
    transform: rotateZ(-75deg) translateX(-150%);
  }
  80% {
    position: absolute;
    top: -800px;
    left: -50%;
    transform: rotateZ(-80deg) translateX(-160%);
  }
  85% {
    position: absolute;
    top: -850px;
    left: -60%;
    transform: rotateZ(-85deg) translateX(-170%);
  }
  90% {
    position: absolute;
    top: -900px;
    left: -60%;
    transform: rotateZ(-90deg) translateX(-180%);
  }
  95% {
    position: absolute;
    top: -950px;
    left: -70%;
    transform: rotateZ(-95deg) translateX(-190%);
  }
  100% {
    position: absolute;
    top: -1000px;
    left: -80%;
    transform: rotateZ(-100deg) translateX(-200%);
  }
}
</style>