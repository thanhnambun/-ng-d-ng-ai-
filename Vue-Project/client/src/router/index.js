import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';
import { STORAGE_KEYS, USER_ROLES, ROUTES } from '../utils/constants.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Scroll behavior for better UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
  routes: [
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'account',
          name: 'AdminAccount',
          component: () => import('@/views/admin/AdminAccount.vue'),
        },
        {
          path: 'course',
          name: 'AdminCourse',
          component: () => import('@/views/admin/AdminCourse.vue'),
        },
        {
          path: 'exam/:id',
          name: 'AdminExam',
          component: () => import('@/views/admin/AdminExam.vue'),
        },
        {
          path: 'questions/:id',
          name: 'AdminQuestion',
          component: () => import('@/views/admin/AdminQuestion.vue'),
        },
        {
          path: 'subject/:id',
          name: 'AdminSubject',
          component: () => import('@/views/admin/AdminSubject.vue'),
        },
      ],
      meta: {
        requiresAuth: true,
        adminOnly: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/user',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'UserHome',
          component: () => import('@/views/user/Home.vue'),
        },
        {
          path: 'course',
          name: 'UserCourse',
          component: () => import('@/views/user/Course.vue'),
        },
        {
          path: 'subject/:id',
          name: 'UserSubject',
          component: () => import('@/views/user/Subject.vue'),
        },
        {
          path: 'exam/:id',
          name: 'UserExam',
          component: () => import('@/views/user/Exam.vue'),
        },
        {
          path: 'contest/:id',
          name: 'UserContest',
          component: () => import('@/views/user/Contest.vue'),
        },
        {
          path: 'test/:id',
          name: 'UserTest',
          component: () => import('@/views/user/Test.vue'),
          meta: { requiresAuth: true }, 
        },
        {
          path: 'result/:id',
          name: 'UserResult',
          component: () => import('@/views/user/Result.vue'),
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('@/views/user/Profile.vue'),
        },
        {
          path: 'history',
          name: 'UserHistory',
          component: () => import('@/views/user/History.vue'),
        },
      ],
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Show loading indicator for route changes
  if (to.name !== from.name) {
    document.body.style.cursor = 'wait';
  }

  const isAuthenticated = !!localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
  const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  const isAdmin = userRole === USER_ROLES.ADMIN;

  // Check authentication requirements
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      await Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để tiếp tục.',
        confirmButtonText: 'Đăng nhập',
      });
      
      next({ 
        name: 'Login', 
        query: { redirect: to.fullPath } 
      });
      return;
    }
    
    // Check admin access
    if (to.meta.adminOnly && !isAdmin) {
      await Swal.fire({
        icon: 'error',
        title: 'Truy cập bị từ chối',
        text: 'Bạn không có quyền truy cập vào khu vực quản trị.',
        confirmButtonText: 'Về trang chủ',
      });
      
      next({ name: 'UserHome' });
      return;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    const redirectTo = isAdmin ? { name: 'AdminAccount' } : { name: 'UserHome' };
    next(redirectTo);
    return;
  }

  next();
});

// After navigation
router.afterEach((to, from) => {
  // Remove loading cursor
  document.body.style.cursor = 'default';
  
  // Update page title
  const baseTitle = 'Learning Management System';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
  
  // Track page views (có thể integrate với Google Analytics)
  if (import.meta.env.PROD) {
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_title: document.title,
    //   page_location: window.location.href,
    // });
  }
});

export default router;
