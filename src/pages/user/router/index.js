import Vue from 'vue'
import VueRouter from "vue-router";
import { checkToken } from "@/pages/user/api";

import Home from "@/pages/user/views/general/Home";
import Logout from "@/pages/user/views/user/Logout";
import UserHome from "@/pages/user/views/user/UserHome";
import BookList from "@/pages/user/views/book/BookList";
import Book from "@/pages/user/views/book/Book";
import NotFound from "@/pages/user/views/general/NotFound"
import Settings from "@/pages/user/views/setting/Settings";
import ProfileSetting from "@/pages/user/views/setting/children/ProfileSetting";
import AccountSetting from "@/pages/user/views/setting/children/AccountSetting";
import BorrowApplicationList from "@/pages/user/views/application/BorrowApplicationList";
import RenewApplicationList from "@/pages/user/views/application/RenewApplicationList";
import ReturnApplicationList from "@/pages/user/views/application/ReturnApplicationList";
import RecordList from "@/pages/user/views/record/RecordList";
import Cookie from "js-cookie";

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
    },
    {
      name: 'logout',
      path: '/logout',
      component: Logout,
    },
    {
      name: 'user-home',
      path: '/user-home/:userName',
      component: UserHome,
    },
    {
      path: '/setting',
      component: Settings,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          name: 'default-setting',
          path: '',
          meta: {
            requiresAuth: true,
          },
          component: ProfileSetting
        },
        {
          name: 'profile-setting',
          path: 'profile',
          meta: {
            requiresAuth: true,
          },
          component: ProfileSetting
        },
        {
          name: 'account-setting',
          path: 'account',
          meta: {
            requiresAuth: true,
          },
          component: AccountSetting
        }
      ]
    },
    {
      name: 'book-list',
      path: '/book',
      component: BookList,
    },
    {
      name: 'book-details',
      path: '/book/:isbn',
      component: Book,
    },
    {
      name: 'record-list',
      path: '/record',
      component: RecordList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'borrow-application-list',
      path: '/borrow-application',
      component: BorrowApplicationList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'renew-application-list',
      path: '/renew-application',
      component: RenewApplicationList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'return-application-list',
      path: '/return-application',
      component: ReturnApplicationList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'not-found',
      path: '*',
      component: NotFound,
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    let token = Cookie.get('token') || '';
    let resCheck = await checkToken(token);
    if (resCheck.data === true) next();
    else {
      Vue.prototype.$Message.error('请登录后重试');
      next({
        name: 'home'
      })
    }
  }
  else next()
})

export default router
