<template>
  <div class="stuff">
    <div class="header">
      <h1>Animal Crossing: New Horizon Helper</h1>
    </div>

    <div class="main-content-wrapper">
      <div class="main-content">
        <h3>Choose your topic:</h3>
        <div class="select-container">
          <div
            class="custom-button"
            :class="(!!choice && choice === 'fish') ? 'active' : ''"
            @click="choose('fish')"
          >Fish</div>
          <div
            class="custom-button"
            :class="(!!choice && choice === 'insects') ? 'active' : ''"
            @click="choose('insects')"
          >Insects</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store/index.js";

export default {
  methods: {
    choose(data) {
      store.commit("assignDisplayData", data);
      store.dispatch("storeSelection");
    }
  },
  computed: {
    choice() {
      return store.state.displayData;
    }
  }
};
</script>
<style>
.stuff {
  background-image: url(../assets/hero-bg-desktop.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: top;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  min-height: 720px;
}

.main-content-wrapper {
  display: flex;
  justify-content: center;
  padding: 25px;
  width: 100%;
  flex-wrap: wrap;
}
.main-content {
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.7);
}

.header {
  position: relative;
  width: 60%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 22px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
}

h1,
h3 {
  width: 100%;
}

.select-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.custom-button {
  border-radius: 22px;
  padding: 20px 25px;
  min-width: 150px;
  margin: 5px;
  background-color: #c4161c;
  color: #ffe46a;
  cursor: pointer;
  font-size: 1.5em;
  transition: 0.25s;
  position: relative;
  user-select: none;
}
.custom-button:hover {
  background-color: #ffe46a;
  color: #c4161c;
}
.custom-button.active {
  background-color: #ffe46a;
  color: #c4161c;
}
.wip {
  pointer-events: none;
}
.WIP {
  position: absolute;
  background-color: #222;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateZ(-17deg);
  width: 200px;
}

@media screen and (max-width: 767px) {
  .select-container {
    flex-wrap: wrap;
  }
  .header {
    width: 85%;
  }
}
</style>