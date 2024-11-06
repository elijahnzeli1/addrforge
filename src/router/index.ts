import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue'),
      meta: { guest: true }
    },
    {
      path: '/dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: () => import('../views/admin/Dashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await authStore.checkAuth();

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/dashboard');
  } else if (to.meta.guest && authStore.user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;