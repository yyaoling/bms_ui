<template>
  <div></div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Logout",
  methods: {
    ...mapActions('user', ['clearUser', 'clearToken']),
  },
  mounted() {
    this.clearToken();
    this.clearUser();
    this.$router.push({
      name: 'login'
    })
  }
}
</script>

<style scoped>

</style>
