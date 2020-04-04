<template>
  <div id="app">
    <Heading />
    <Content />
    <Footer />
  </div>
</template>

<script>
import Heading from "./components/Heading.vue";
import Content from "./components/Content.vue";
import Footer from "./components/Footer.vue";
import store from "./store/index.js";

export default {
  name: "App",
  components: {
    Heading,
    Content,
    Footer
  },
  mounted() {
    store.dispatch("getData");
  }
};
</script>
