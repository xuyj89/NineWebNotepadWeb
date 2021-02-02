import {createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import MainPage from '../components/MainPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // route -> routes
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/mainPage',
      name: 'MainPage',
      component: MainPage,
    }
　]
});

export default router;