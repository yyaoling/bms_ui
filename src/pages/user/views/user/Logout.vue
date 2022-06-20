<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "Logout",
  methods: {
    ...mapActions('user', ['clearUser', 'clearToken']),
  },
  mounted() {
    this.clearToken();
    this.clearUser();
    this.$router.push({
      name: 'home'
    })
  }
}
</script>

<style scoped>

</style>
