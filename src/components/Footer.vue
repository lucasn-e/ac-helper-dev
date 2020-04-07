<template>
  <div class="footer">
    made by Nnay (@acnnay on instagram || Nnay#8093 on discord) - data used from gamewith.net
    <br />I am very lazy so please be patient or send me messages to encourage me to continue.
    <a
      href="https://discord.gg/84EsCJz"
    >Join the Discord!</a>
    Icons made by
    <a
      href="https://www.flaticon.com/authors/dinosoftlabs"
      title="DinosoftLabs"
    >DinosoftLabs</a> from
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