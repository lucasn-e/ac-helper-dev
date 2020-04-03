<template>
  <div id="app">
    <Heading />
    <Seperator />
    <Content />
    <Footer />
  </div>
</template>

<script>
import Heading from "./components/Heading.vue";
import Seperator from "./components/Seperator.vue";
import Content from "./components/Content.vue";
import Footer from "./components/Footer.vue";
import store from "./store/index.js";

export default {
  name: "App",
  components: {
    Heading,
    Seperator,
    Content,
    Footer
  },
  mounted() {
    store.dispatch("getData");
  }
};
</script>
