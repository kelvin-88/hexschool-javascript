<template>
  <div>
    <h2>後台產品列表</h2>

    <div id="app" class="container mt-3">
      <div>
        <Loading :active.sync="isLoading"></Loading>
        <input id="customFile" type="file" class="form-control" @change="uploadFile" />
        此範例未完整，請參考課程介紹修正
        <img :src="filePath" alt />
        {{ filePath }}
      </div>
      <pagination :pages="pages" v-on:emit-pages="getProducts"></pagination>
    </div>
  </div>
</template>
<script>
import Pagination from './Pagination.vue';

export default {
  components: {
    Pagination,
  },
  created() {},
  props: ['token'],
  methods: {
    uploadFile() {
      this.isLoading = true;

      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/storage`;

      const uploadedfile = document.querySelector('#customFile').files[0];

      // 轉成 Form Data
      const formData = new FormData();
      formData.append('file', uploadedfile);

      this.$http
        .post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          this.isLoading = false;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
  },

  data() {
    return {
      isLoading: false,
      filePath: '',
    };
  },
};
</script>
