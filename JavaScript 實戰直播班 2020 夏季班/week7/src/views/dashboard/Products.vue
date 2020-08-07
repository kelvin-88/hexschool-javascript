<template>
  <div>
    <h2>後台產品列表</h2>

    <div id="app" class="container mt-3">
      <div>
        <Loading :active.sync="isLoading"></Loading>
        <div class="text-right mt-4">
          <button class="btn btn-primary" @click="openModal('new')">
            建立新的產品
          </button>
        </div>
        <table class="table mt-4">
          <thead>
            <tr>
              <th width="120">
                分類
              </th>
              <th>產品名稱</th>
              <th width="120">
                原價
              </th>
              <th width="120">
                售價
              </th>
              <th width="100">
                是否啟用
              </th>
              <th width="120">
                編輯
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in products" :key="item.id">
              <td>{{ item.category }}</td>
              <td>{{ item.title }}</td>
              <td class="text-right">
                {{ item.origin_price }}
              </td>
              <td class="text-right">
                {{ item.price }}
              </td>
              <td>
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
              </td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click="openModal('edit', item, index)"
                  >
                    編輯
                  </button>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="openModal('delete', item, index)"
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination :pages="pages" v-on:emit-pages="getProducts"></pagination>
        <!-- Modal -->
        <div
          id="productModal"
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
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label for="imageUrl">輸入圖片網址</label>
                      <input
                        id="imageUrl"
                        v-model="tempProduct.imageUrl[0]"
                        type="text"
                        class="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img class="img-fluid" :src="tempProduct.imageUrl" alt />
                  </div>
                  <div class="col-sm-8">
                    <div class="form-group">
                      <label for="title">標題</label>
                      <input
                        id="title"
                        v-model="tempProduct.title"
                        type="text"
                        class="form-control"
                        placeholder="請輸入標題"
                      />
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="category">分類</label>
                        <input
                          id="category"
                          v-model="tempProduct.category"
                          type="text"
                          class="form-control"
                          placeholder="請輸入分類"
                        />
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">單位</label>
                        <input
                          id="unit"
                          v-model="tempProduct.unit"
                          type="unit"
                          class="form-control"
                          placeholder="請輸入單位"
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                        <input
                          id="origin_price"
                          v-model="tempProduct.origin_price"
                          type="number"
                          class="form-control"
                          placeholder="請輸入原價"
                        />
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">售價</label>
                        <input
                          id="price"
                          v-model="tempProduct.price"
                          type="number"
                          class="form-control"
                          placeholder="請輸入售價"
                        />
                      </div>
                    </div>
                    <hr />

                    <div class="form-group">
                      <label for="description">產品描述</label>
                      <textarea
                        id="description"
                        v-model="tempProduct.description"
                        type="text"
                        class="form-control"
                        placeholder="請輸入產品描述"
                      >
                      </textarea>
                    </div>
                    <div class="form-group">
                      <label for="content">說明內容</label>
                      <textarea
                        id="description"
                        v-model="tempProduct.content"
                        type="text"
                        class="form-control"
                        placeholder="請輸入說明內容"
                      >
                      </textarea>
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          id="is_enabled"
                          v-model="tempProduct.is_enabled"
                          class="form-check-input"
                          type="checkbox"
                          :true-value="1"
                          :false-value="0"
                        />
                        <label class="form-check-label" for="is_enabled">是否啟用</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                  取消
                </button>
                <button type="button" class="btn btn-primary" @click="updateProduct">
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="delProductModal"
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
                  <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                是否刪除
                <strong class="text-danger">{{ tempProduct.title }}</strong>
                商品(刪除後將無法恢復)。
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                  取消
                </button>
                <button type="button" class="btn btn-danger" @click="delProduct">
                  確認刪除
                </button>
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
    Pagination
  },
  created() {
    this.getProducts(1);
  },
  props: ['token'],
  methods: {
    refreshScreen() {
      this.getProducts(this.pages.current_page);
    },
    getProducts(page = 1) {
      this.isLoading = true;

      //let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/products?page=${page}`;
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/ec/products?page=${page}`;

      this.$http
        .get(api)
        .then(response => {
          this.isLoading = false;
          //console.log(response);
          console.log(response.data.data);
          //this.products = JSON.parse(JSON.stringify(response.data.data));
          this.products = response.data.data;

          this.pages.current_page = response.data.meta.pagination.current_page;
          this.pages.total_pages = response.data.meta.pagination.total_pages;
          //this.pages.total_pages = 5;

          //this.pages.current_page = 2;
          //this.pages.total_pages = 5;

          console.log(this.products);
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },
    updateProduct() {
      // newly added
      console.log(this.tempProduct);
      var api;
      switch (this.isNew) {
        case true: // add new product
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/product`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
          this.$http
            .post(api, this.tempProduct)
            .then(response => {
              console.log(this.tempProduct);
              //this.products.push(this.tempProduct);
              $('#productModal').modal('hide');
              this.refreshScreen();
            })
            .catch(error => {
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
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
          /*
          console.log("xxx");
          console.log(this.tempProduct);
          console.log(Array.isArray(this.tempProduct.imageUrl));
          if (!Array.isArray(this.tempProduct.imageUrl)) {
            this.tempProduct.imageUrl[0] = this.tempProduct.imageUrl;
          }
          console.log(this.tempProduct);
          console.log(Array.isArray(this.tempProduct.imageUrl));
          */
          this.$http
            .patch(api, this.tempProduct)
            .then(response => {
              //console.log(this.tempProduct);
              this.refreshScreen();
              $('#productModal').modal('hide');
            })
            .catch(error => {
              console.log(error);
              alert(error.response.data.message);
            });

          /*
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == this.tempProduct.id) {
              //console.log(i);
              this.products[i] = this.tempProduct;
              //this.products.$set(i, this.tempProduct);
              this.$set(this.products, i, this.tempProduct);
            }
          }
          */

          this.products[this.tempIndex] = this.tempProduct;
          this.$set(this.products, this.tempIndex, this.tempProduct);
          break;
      }
      //console.log(this.products);
    },
    openModal(isNew, item, index) {
      this.tempIndex = index;
      console.log(this.tempIndex);
      switch (isNew) {
        case 'new':
          this.title = '新增產品';
          this.tempProduct = {
            imageUrl: []
          };
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'edit':
          this.title = '編輯產品';
          this.tempProduct = Object.assign({}, item);
          this.isNew = false;
          $('#productModal').modal('show');
          break;
        case 'delete':
          $('#delProductModal').modal('show');
          this.tempProduct = Object.assign({}, item);
          break;
        default:
          break;
      }
    },
    delProduct() {
      console.log(this.tempProduct);
      var api;

      api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`;
      //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      this.$http
        .delete(api, this.tempProduct)
        .then(response => {
          //this.products.splice(this.tempIndex, 1);
          //console.log(this.products);
          $('#delProductModal').modal('hide');
          this.refreshScreen();
        })
        .catch(error => {
          console.log(error);
          alert(error.response.data.message);
        });

      // newly added
      /*
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == this.tempProduct.id) {
          console.log(i);
          this.products.splice(i, 1);
        }
      }
      */
    }
  },
  data() {
    return {
      isLoading: false,
      title: '',
      products: [],
      tempProduct: {
        imageUrl: []
      },
      tempIndex: 0,
      user: {
        token: '',
        uuid: ''
      },
      pages: { current_page: 1, total_pages: 0 }
    };
  }
};
</script>
