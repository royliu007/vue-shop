<template>
  <div id="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('./login')
    }
  }
}
</script>
<style >
</style>