<template>
  <div id="app">
    <h2>前台管理頁面</h2>
    <!--div id="nav">
      <router-link to="/">首頁</router-link> | <router-link to="/products">產品列表</router-link> |
      <router-link to="/shoppingcart">購物車</router-link> |
      <router-link to="/about">關於我們</router-link> |
      <router-link to="/payment">結帳</router-link> |
      <router-link to="/checkout">結帳完成</router-link> |
      <router-link to="/admin">後台管理</router-link>
    </div-->

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">前台管理頁面</a>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shoppingcart">購物車</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">關於我們</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/payment">結帳</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/checkout">結帳完成</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin">後台管理</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    console.log(process.env.VUE_APP_UUID);
  },
  data() {
    return {};
  },
  methods: {
    checkLogin() {}
  }
};
</script>
