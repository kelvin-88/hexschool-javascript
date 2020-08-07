<template>
  <div>
    <h2>後台優待券列表</h2>

    <div id="app" class="container mt-3">
      <div>
        <Loading :active.sync="isLoading"></Loading>
        <div class="text-right mt-4">
          <button class="btn btn-primary" @click="openModal('new')">建立新的優待券</button>
        </div>
        <table class="table mt-4">
          <thead>
            <tr>
              <th width="200">名稱</th>
              <th>序號</th>
              <th width="120">折扣百分比</th>
              <th width="100">是否啟用</th>
              <th width="200">到期日</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in orders" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.code }}</td>
              <td class="text-right">{{ item.percent }}</td>
              <td>
                <span v-if="item.enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
              </td>
              <td>{{ item.deadline.datetime }}</td>
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
        <pagination :pages="pages" v-on:emit-pages="getCoupons"></pagination>
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
                  <div class="col-sm-8">
                    <div class="form-group">
                      <label for="title">名稱</label>
                      <input
                        id="title"
                        v-model="tempCoupon.title"
                        type="text"
                        class="form-control"
                        placeholder="請輸入名稱"
                      />
                    </div>

                    <label for="code">序號</label>
                    <input
                      id="code"
                      v-model="tempCoupon.code"
                      type="text"
                      class="form-control"
                      placeholder="請輸入序號"
                    />

                    <div class="form-group">
                      <label for="percent">折扣百分比</label>
                      <input
                        id="percent"
                        v-model.number="tempCoupon.percent"
                        type="number"
                        class="form-control"
                        placeholder="請輸入折扣百分比"
                      />
                    </div>

                    <div class="form-group">
                      <label for="coddeadline_at">到期日</label>
                      <datepicker v-model="deadline" :inline="true"></datepicker>
                      <!--input
                        id="deadline_at"
                        v-model="tempCoupon.deadline_at"
                        type="text"
                        class="form-control"
                        placeholder="請輸入到期日"
                      /-->
                    </div>

                    <div class="form-group">
                      <div class="form-check">
                        <input
                          id="enabled"
                          v-model="tempCoupon.enabled"
                          class="form-check-input"
                          type="checkbox"
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
                <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="delCouponModal"
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
                  <span>刪除優待券</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                是否刪除
                <strong class="text-danger">{{ tempCoupon.title }}</strong>
                優待券(刪除後將無法恢復)。
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                  取消
                </button>
                <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
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
    this.getCoupons(1);
  },
  props: ['token'],
  methods: {
    refreshScreen() {
      this.getCoupons(this.pages.current_page);
    },
    getCoupons(page = 1) {
      this.isLoading = true;

      //let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/orders?page=${page}`;
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupons?page=${page}`;

      this.$http
        .get(api)
        .then(response => {
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
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },
    updateCoupon() {
      // newly added
      console.log(this.tempCoupon);
      // if (this.tempCoupon.is_enabled == 1) {
      //   this.tempCoupon.enabled = true;
      // } else {
      //   this.tempCoupon.enabled = false;
      //      }
      this.tempCoupon.deadline_at = this.deadline.toISOString().split('T')[0];
      /*
      this.tempCoupon.deadline_at =
        this.deadline.getFullYear() +
        '-' +
        (this.deadline.getMonth() + 1) +
        '-' +
        this.deadline.getDate();
        */
      //this.tempCoupon.deadline_at = '2020-08-23';
      this.tempCoupon.deadline_at = this.tempCoupon.deadline_at + ' 23:59:59';
      var api;
      switch (this.isNew) {
        case true: // add new product
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupon`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
          this.$http
            .post(api, this.tempCoupon)
            .then(response => {
              console.log(this.tempCoupon);
              //this.orders.push(this.tempCoupon);
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
          api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`;
          //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempCoupon.id}`;
          /*
          console.log("xxx");
          console.log(this.tempCoupon);
          console.log(Array.isArray(this.tempCoupon.imageUrl));
          if (!Array.isArray(this.tempCoupon.imageUrl)) {
            this.tempCoupon.imageUrl[0] = this.tempCoupon.imageUrl;
          }
          console.log(this.tempCoupon);
          console.log(Array.isArray(this.tempCoupon.imageUrl));
          */
          this.$http
            .patch(api, this.tempCoupon)
            .then(response => {
              //console.log(this.tempCoupon);
              this.refreshScreen();
              $('#productModal').modal('hide');
            })
            .catch(error => {
              console.log(error);
              alert(error.response.data.message);
            });

          /*
          for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i].id == this.tempCoupon.id) {
              //console.log(i);
              this.orders[i] = this.tempCoupon;
              //this.orders.$set(i, this.tempCoupon);
              this.$set(this.orders, i, this.tempCoupon);
            }
          }
          */

          this.orders[this.tempIndex] = this.tempCoupon;
          this.$set(this.orders, this.tempIndex, this.tempCoupon);
          break;
      }
      //console.log(this.orders);
    },
    openModal(isNew, item, index) {
      this.tempIndex = index;
      console.log(this.tempIndex);
      switch (isNew) {
        case 'new':
          this.title = '新增優待券';
          this.tempCoupon = {};
          this.isNew = true;
          this.deadline = new Date();
          this.tempCoupon.enabled = false;
          $('#productModal').modal('show');
          break;
        case 'edit':
          this.title = '編輯優待券';
          this.tempCoupon = Object.assign({}, item);
          this.isNew = false;
          //console.log('aaa');
          //console.log(item);
          //console.log(item.deadline.datetime);
          this.deadline = new Date(item.deadline.datetime);
          //console.log(this.deadline);
          $('#productModal').modal('show');
          break;
        case 'delete':
          $('#delCouponModal').modal('show');
          this.tempCoupon = Object.assign({}, item);
          break;
        default:
          break;
      }
    },
    delCoupon() {
      console.log(this.tempCoupon);
      var api;

      api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`;
      //api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempCoupon.id}`;
      this.$http
        .delete(api, this.tempCoupon)
        .then(response => {
          //this.orders.splice(this.tempIndex, 1);
          //console.log(this.orders);
          $('#delCouponModal').modal('hide');
          this.refreshScreen();
        })
        .catch(error => {
          console.log(error);
          alert(error.response.data.message);
        });

      // newly added
      /*
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].id == this.tempCoupon.id) {
          console.log(i);
          this.orders.splice(i, 1);
        }
      }
      */
    }
  },
  data() {
    return {
      deadline: new Date('2011-04-11T10:20:30Z'),
      isLoading: false,
      title: '',
      orders: [],
      tempCoupon: {
        code: '',
        title: '',
        percent: 0,
        enabled: false,
        deadline_at: ''
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
