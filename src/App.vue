<template>
  <div id="app">
    <Home />
    <Seperator />
    <Display />
    <Footer />
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Seperator from "./components/Seperator.vue";
import Display from "./components/Display.vue";
import Footer from "./components/Footer.vue";
import store from "./store/index.js";

export default {
  name: "App",
  components: {
    Home,
    Seperator,
    Display,
    Footer
  },
  mounted() {
    store.dispatch("getData");
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  font-family: "Gorditas", cursive;
}
body {
  margin: 0;
}
</style>
