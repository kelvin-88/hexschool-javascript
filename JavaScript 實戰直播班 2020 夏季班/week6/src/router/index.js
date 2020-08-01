/* eslint-disable */

import Vue from 'vue';
import VueRouter from 'vue-router';
//import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '../views/Layout.vue'),
    children: [
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/frontend/About.vue')
      },
      {
        path: '/products',
        component: () => import(/* webpackChunkName: "about" */ '../views/frontend/Products.vue')
      },
      {
        path: '/shoppingcart',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/frontend/ShoppingCart.vue')
      },
      {
        path: '/payment',
        component: () => import(/* webpackChunkName: "about" */ '../views/frontend/Payment.vue')
      },
      {
        path: '/checkout',
        component: () => import(/* webpackChunkName: "about" */ '../views/frontend/Checkout.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Dashboard.vue'),
    children: [
      {
        path: 'products',
        component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Products.vue')
      },
      {
        path: 'coupons',
        component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Coupons.vue')
      },
      {
        path: 'orders',
        component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Orders.vue')
      },
      {
        path: 'images',
        component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Images.vue')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
