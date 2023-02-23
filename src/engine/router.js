import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function loadView (view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `./pages/${view}.vue`)
}

let router = new Router({
  routes: [
    {
      path: '/',
      component: loadView('default/index'),
      name: 'guest'
    },
    {
      path: '/guest-form',
      component: loadView('guest-wifi/guest-form'),
      name: 'guest-form'
    },
    {
      path: '/ticketing',
      component: loadView('guest-wifi/ticketing'),
      name: 'ticketing'
    },
    {
      path: '/codes',
      component: loadView('guest-wifi/codes'),
      name: 'codes'
    },
    {
      path: '/sso',
      component: loadView('guest-wifi/sso'),
      name: 'sso'
    },
    {
      path: '/social',
      component: loadView('guest-wifi/guest-social'),
      name: 'social'
    },
    {
      path: '/sponsor',
      component: loadView('sponsoring/sponsor-page'),
      name: 'sponsor'
    },
    {
      path: '/sponsor-code',
      component: loadView('sponsoring/sponsor-code'),
      name: 'sponsor-code'
    },
    {
      path: '/sponsor-wait',
      component: loadView('sponsoring/sponsor-wait'),
      name: 'sponsor-wait'
    },
    {
      path: '/sponsor-auth',
      component: loadView('sponsoring/sponsor-auth'),
      name: 'sponsor-auth'
    },
    {
      path: '/sms-reg',
      component: loadView('sms-access/sms-registration'),
      name: 'sms-reg'
    },
    {
      path: '/sms-access-code',
      component: loadView('sms-access/sms-access-code'),
      name: 'sms-access-code'
    },
    {
      path: '/user-login',
      component: loadView('userpwd/user-login'),
      name: 'sms-access-code'
    },
    {
      path: '/wifi-unavailable',
      component: loadView('generic/wifi-unavailable-page'),
      name: 'wifi-unavailable'
    },
    {
      path: '/login',
      component: loadView('generic/access-granted-page'),
      name: 'login'
    },
    {
      path: '/wifi4eu',
      component: loadView('wifi4eu/wifi4eu'),
      name: 'wifi4eu'
    },
    {
      path: '*',
      component: loadView('generic/wifi-unavailable-page'),
      name: '404'
    }
  ]
})

export default router
