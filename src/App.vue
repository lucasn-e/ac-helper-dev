<template>
  <div id="app">
    <Home @choice="choose" />
    <Seperator />
    <Display :data="choice" />
    <Footer />
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Seperator from "./components/Seperator.vue";
import Display from "./components/Display.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  data() {
    return {
      choice: null
    };
  },
  components: {
    Home,
    Seperator,
    Display,
    Footer
  },
  methods: {
    choose(stuff) {
      this.choice = stuff;
    }
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
