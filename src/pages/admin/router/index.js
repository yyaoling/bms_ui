import VueRouter from "vue-router";

import Login from "@/pages/admin/views/general/Login";
import Logout from "@/pages/admin/views/general/Logout";
import Home from "@/pages/admin/views/Home";
import BorrowApplicationList from "@/pages/admin/views/application/BorrowApplicationList";
import RenewApplicationList from "@/pages/admin/views/application/RenewApplicationList";
import ReturnApplicationList from "@/pages/admin/views/application/ReturnApplicationList";
import UserList from "@/pages/admin/views/user/UserList";
import BookList from "@/pages/admin/views/book/BookList";
import Settings from "@/pages/admin/views/setting/Settings";
import ProfileSetting from "@/pages/admin/views/setting/children/ProfileSetting";
import AddBook from "@/pages/admin/views/book/AddBook";
import RecordList from "@/pages/admin/views/record/RecordList";
import EditBook from "@/pages/admin/views/book/EditBook";
import Cookie from "js-cookie";
import AddBookOnline from '../views/addbookonline'
import dashboard from "@/pages/admin/views/dashboard/index.vue";
import Vue from "vue";
import {
  checkToken
} from "@/pages/user/api";

const router = new VueRouter({
  mode: 'history',
  base: '/admin/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect:'/dashboard',
      meta: {
        requiresAdmin: true,
        requiresSuperAdmin: false,
      },
      children: [
        {
          path:'dashboard',
          name:'dashboard',
          component:dashboard,
          meta: {
            requiresAdmin: false,
            requiresSuperAdmin: false,
          }
        },
        {
          path: 'borrow-application',
          name: 'borrow-application-list',
          component: BorrowApplicationList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: false,
          }
        },
        {
          path: 'renew-application',
          name: 'renew-application-list',
          component: RenewApplicationList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: false,
          }
        },
        {
          path: 'return-application',
          name: 'return-application-list',
          component: ReturnApplicationList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: false,
          }
        },
        {
          name: 'user-list',
          path: 'user',
          component: UserList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        },
        {
          path: 'user/setting',
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
          component: Settings,
          children: [
            {
              name: 'default-setting',
              path: '',
              meta: {
                requiresAdmin: true,
                requiresSuperAdmin: true,
              },
              component: ProfileSetting
            },
            {
              name: 'profile-setting',
              path: 'profile',
              meta: {
                requiresAdmin: true,
                requiresSuperAdmin: true,
              },
              component: ProfileSetting
            },
          ]
        },
        {
          name: 'book-list',
          path: 'book',
          component: BookList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        },
        {
          name: 'book-add',
          path: 'book/add',
          component: AddBook,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        },
        {
          name: 'book-edit',
          path: 'book/edit',
          component: EditBook,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        },
        {
          name: 'record-list',
          path: 'record',
          component: RecordList,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        },
        {
          name: 'AddBookOnline',
          path: 'addbookonline',
          component: AddBookOnline,
          meta: {
            requiresAdmin: true,
            requiresSuperAdmin: true,
          },
        }
      ]
    },
    {
      path: '*',
      redirect: '/login',
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    let token = Cookie.get('token') || '';
    await checkToken(token).then(resCheck => {
      if (resCheck.data === true) {
        let user = JSON.parse(Cookie.get('user')) || { };
        if (user.role === 1 || (user.role === 2 && to.meta.requiresSuperAdmin)) {
          Vue.prototype.$Message.error('权限不足');
          next({
            name: 'login'
          })
        } else next();
      }
      else {
        Vue.prototype.$Message.error('请登录后重试');
        next({
          name: 'login'
        })
      }
    })
  }
  else next()
})

export default router
