<template>
  <div class="footer">
    <br />I am very lazy so please be patient or send me messages to encourage me to continue.
    Icons made by
    <a
      href="https://www.flaticon.com/authors/dinosoftlabs"
      title="DinosoftLabs"
    >DinosoftLabs</a> and
    <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from
    <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    <br />
    {{ lang.translation }}: {{ lang.transCredits }} ❤️
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["lang"])
  }
};
</script>
