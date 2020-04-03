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
          <div
            class="custom-button"
            :class="(!!choice && choice === 'golden-tools') ? 'active' : ''"
            @click="choose('golden-tools')"
          >Golden Tools</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store/index.js";
import { mapState } from "vuex";

export default {
  methods: {
    choose(data) {
      store.commit("assignDisplayData", data);
      store.dispatch("storeSelection");
    }
  },
  computed: {
    ...mapState({ choice: "displayData" })
  }
};
</script>