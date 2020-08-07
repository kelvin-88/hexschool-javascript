<template>
  <div>
    <h2>圖片儲存列表</h2>

    <div id="app" class="container mt-3">
      <div>
        <Loading :active.sync="isLoading"></Loading>
        <div class="text-right mt-4">
          <button class="btn btn-primary" @click="openModal('new')">建立新的圖片</button>
        </div>
        <table class="table mt-4">
          <thead>
            <tr>
              <th>圖片</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in orders" :key="item.id">
              <img :src="item.path" height="150px" width="250px" />
              <td>
                <div class="btn-group">
                  <!--button
                    class="btn btn-outline-primary btn-sm"
                    @click="openModal('edit', item, index)"
                  >編輯</button-->
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="openModal('delete', item, index)"
                  >刪除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination :pages="pages" v-on:emit-pages="getStorage"></pagination>
        <!-- Modal -->
        <div
          id="imageModal"
          class="modal fade"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
              <div class="modal-header bg-dark text-white">
                <h5 id="exampleModalLabel" class="modal-title">
                  <span>{{ title }}</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Loading :active.sync="isLoading"></Loading>
                <div class="row">
                  <input id="customFile" type="file" class="form-control" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="uploadFile">確認</button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="delImageModal"
          class="modal fade"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
              <div class="modal-header bg-danger text-white">
                <h5 id="exampleModalLabel" class="modal-title">
                  <span>刪除圖片</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">是否刪除圖片(刪除後將無法恢復)。</div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delImage">確認刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from './Pagination.vue';
import $ from 'jquery';

export default {
  components: {
    Pagination,
  },
  created() {
    this.getStorage(1);
  },
  props: ['token'],
  methods: {
    uploadFile() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/storage`;

      const uploadedfile = document.querySelector('#customFile').files[0];

      // 轉成 Form Data
      const formData = new FormData();
      formData.append('file', uploadedfile);

      // 路由、驗證
      // axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;

      // 請自行完成 Ajax 範例
      this.$http
        .post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          this.isLoading = false;
          console.log(response);
          $('#imageModal').modal('hide');
          this.refreshScreen();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          $('#imageModal').modal('hide');
        });
    },
    refreshScreen() {
      this.getStorage(this.pages.current_page);
    },
    getStorage(page = 1) {
      this.isLoading = true;

      //let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/orders?page=${page}`;
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/storage?page=${page}`;

      this.$http
        .get(api)
        .then((response) => {
          this.isLoading = false;
          //console.log(response);
          console.log(response.data.data);
          //this.orders = JSON.parse(JSON.stringify(response.data.data));
          this.orders = response.data.data;

          this.pages.current_page = response.data.meta.pagination.current_page;
          this.pages.total_pages = response.data.meta.pagination.total_pages;
          //this.pages.total_pages = 5;

          //this.pages.current_page = 2;
          //this.pages.total_pages = 5;

          console.log(this.orders);
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    updateCoupon() {
      // newly added
      console.log(this.tempImage);
      // if (this.tempImage.is_enabled == 1) {
      //   this.tempImage.enabled = true;
      // } else {
      //   this.tempImage.enabled = false;
      //      }
      this.tempImage.deadline_at = this.deadline.toISOString().split('T')[0];
      /*
      this.tempImage.deadline_at =
        this.deadline.getFullYear() +
        '-' +
        (this.deadline.getMonth() + 1) +
        '-' +
        this.deadline.getDate();
        */
      //this.tempImage.deadline_at = '2020-08-23';
      this.tempImage.deadline_at = this.tempImage.deadline_at + ' 23:59:59';
      var api;
      switch (this.isNew) {
        case true: // add new product
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupon`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
          this.$http
            .post(api, this.tempImage)
            .then((response) => {
              console.log(this.tempImage);
              //this.orders.push(this.tempImage);
              $('#imageModal').modal('hide');
              this.refreshScreen();
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.message);
              /*
              for (err in error.response.data.errors) {
                alert(err);
                alert(err.message);
                console.log(err);
              }
              */
            });

          break;
        case false: // edit product
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempImage.id}`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempImage.id}`;
          /*
          console.log("xxx");
          console.log(this.tempImage);
          console.log(Array.isArray(this.tempImage.imageUrl));
          if (!Array.isArray(this.tempImage.imageUrl)) {
            this.tempImage.imageUrl[0] = this.tempImage.imageUrl;
          }
          console.log(this.tempImage);
          console.log(Array.isArray(this.tempImage.imageUrl));
          */
          this.$http
            .patch(api, this.tempImage)
            .then((response) => {
              //console.log(this.tempImage);
              this.refreshScreen();
              $('#imageModal').modal('hide');
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.message);
            });

          /*
          for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i].id == this.tempImage.id) {
              //console.log(i);
              this.orders[i] = this.tempImage;
              //this.orders.$set(i, this.tempImage);
              this.$set(this.orders, i, this.tempImage);
            }
          }
          */

          this.orders[this.tempIndex] = this.tempImage;
          this.$set(this.orders, this.tempIndex, this.tempImage);
          break;
      }
      //console.log(this.orders);
    },
    openModal(isNew, item, index) {
      this.tempIndex = index;
      console.log(this.tempIndex);
      switch (isNew) {
        case 'new':
          this.title = '新增圖片';
          this.tempImage = {};
          this.isNew = true;
          document.querySelector('#customFile').value = [];
          $('#imageModal').modal('show');
          break;
        case 'edit':
          this.title = '編輯圖片';
          this.tempImage = Object.assign({}, item);
          this.isNew = false;
          //console.log('aaa');
          //console.log(item);
          //console.log(item.deadline.datetime);
          this.deadline = new Date(item.deadline.datetime);
          //console.log(this.deadline);
          $('#imageModal').modal('show');
          break;
        case 'delete':
          $('#delImageModal').modal('show');
          this.tempImage = Object.assign({}, item);
          break;
        default:
          break;
      }
    },
    delImage() {
      this.isLoading = true;
      console.log(this.tempImage);
      var api;

      api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/storage/${this.tempImage.id}`;
      //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempImage.id}`;
      this.$http
        .delete(api, this.tempImage)
        .then((response) => {
          this.isLoading = false;
          //this.orders.splice(this.tempIndex, 1);
          //console.log(this.orders);
          $('#delImageModal').modal('hide');
          this.refreshScreen();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          alert(error.response.data.message);
        });

      // newly added
      /*
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].id == this.tempImage.id) {
          console.log(i);
          this.orders.splice(i, 1);
        }
      }
      */
    },
  },
  data() {
    return {
      deadline: new Date('2011-04-11T10:20:30Z'),
      isLoading: false,
      filePath: '',
      title: '',
      orders: [],
      tempImage: {
        id: '',
        path: '',
      },
      tempIndex: 0,
      user: {
        token: '',
        uuid: '',
      },
      pages: { current_page: 1, total_pages: 0 },
    };
  },
};
</script>
