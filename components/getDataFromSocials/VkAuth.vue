<template>
  <div class="icon" @click="vkLogin">
    <span class="icon-vk"></span>
  </div>
</template>

<script>

export default {
  methods: {
    vkLogin () {
      //window.location.href = "https://oauth.vk.com/authorize?client_id=8094606&display=page&redirect_uri=http://localhost:3000/callback&scope=friends&response_type=code&v=5.131";
    },
  }
}
</script>

<style scoped>

</style>