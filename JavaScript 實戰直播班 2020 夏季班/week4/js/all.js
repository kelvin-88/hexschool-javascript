/* global Vue */
/* eslint-disable no-new */

new Vue({
  el: "#app",
  data: {
    title: "",
    products: [],
    tempProduct: {
      imageUrl: [],
    },
    tempIndex: 0,
    user: {
      token: "",
      uuid: "",
    },
    pages: { current_page: 1, total_pages: 0 },
  },
  created() {
    this.user.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    this.user.uuid = document.cookie.replace(
      /(?:(?:^|.*;\s*)myUUID\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.user.token}`,
    };
    //axios.defaults.headers = `Bear ${this.user.token}`;

    this.refreshScreen();
  },
  methods: {
    refreshScreen() {
      this.getProducts(this.pages.current_page);
    },
    getProducts(page = 1) {
      //this.pages.current_page = 2;
      //this.pages.total_pages = 5;

      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/products?page=${page}`;

      axios
        .get(api)
        .then((response) => {
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
        .catch((error) => {
          console.log(error);
        });
    },
    updateProduct() {
      // newly added
      console.log(this.tempProduct);
      var api;
      switch (this.isNew) {
        case true: // add new product
          api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
          axios
            .post(api, this.tempProduct)
            .then((response) => {
              console.log(this.tempProduct);
              //this.products.push(this.tempProduct);
              $("#productModal").modal("hide");
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
          api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
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
          axios
            .patch(api, this.tempProduct)
            .then((response) => {
              //console.log(this.tempProduct);
              this.refreshScreen();
              $("#productModal").modal("hide");
            })
            .catch((error) => {
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
        case "new":
          this.title = "新增產品";
          this.tempProduct = {
            imageUrl: [],
          };
          this.isNew = true;
          $("#productModal").modal("show");
          break;
        case "edit":
          this.title = "編輯產品";
          this.tempProduct = Object.assign({}, item);
          this.isNew = false;
          $("#productModal").modal("show");
          break;
        case "delete":
          $("#delProductModal").modal("show");
          this.tempProduct = Object.assign({}, item);
          break;
        default:
          break;
      }
    },
    delProduct() {
      console.log(this.tempProduct);
      var api;

      api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      axios
        .delete(api, this.tempProduct)
        .then((response) => {
          //this.products.splice(this.tempIndex, 1);
          //console.log(this.products);
          $("#delProductModal").modal("hide");
          this.refreshScreen();
        })
        .catch((error) => {
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
    },
  },
});
