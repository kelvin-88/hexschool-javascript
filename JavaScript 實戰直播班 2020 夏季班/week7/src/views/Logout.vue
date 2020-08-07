<template>
  <div class="about">
    <h1>登出</h1>

    <div class="container">
      <p class="mt-5 mb-3 text-muted">&copy; 2020~∞ - 六角學院</p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.logout();
  },
  methods: {
    logout() {
      document.cookie =
        'hexToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      this.$router.push('/admin');
    },
  },
};
</script>

