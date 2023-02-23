import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { checkWorkspaceApiKey } from './helpers'

// Layouts
// ----------------------------------
import LayoutLogin from '@/components/layouts/layout-login'
import LayoutOrganization from '@/components/layouts/layout-organization'
import LayoutMain from '@/components/layouts/layout-main'
import LayoutBuilder from '@/components/layouts/layout-builder'
import LayoutAdministration from '@/components/layouts/layout-administration'
import LayoutWorkspace from '@/components/layouts/layout-workspace'

// Users
// ----------------------------------
import LoginAuthToken from '@/components/login/login-auth-token'
import EmailVerification from '@/components/registration/email-verification'
import InviteSignup from '@/components/registration/invite-signup'
import AuthTokenSignup from '@/components/registration/auth-token-signup'

// Errors
// ----------------------------------
import ErrorPage from '@/components/pages/error-page'

// Routes
// ----------------------------------
import AuthRoutes from './auth'
import WorkspaceRoutes from './workspace'
import OrganizationRoutes from './organization'
import BuilderRoutes from './builder'
import AdministrationRoutes from './administration'

import Home from '@/components/pages/Home'
const UserProfile = () => import(/* webpackChunkName: "profile" */ '@/components/user/profile')

import documentation from '@/components/documentation/documentation'

import WorkspaceCreatePage from '@/components/workspace/workspace-create-page'
import OrganizationCreateModeSelectPage from '@/components/organization/organization-create-mode-select-page'
import OrganizationManualCreatePage from '@/components/organization/organization-manual-create-page'
import OrganizationQuickCreatePage from '@/components/organization/organization-quick-create-page'

import Ls from '@/services/ls'

import { checkPermissions } from '@/utils/permissions'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login/auth-token',
      name: 'LoginAuthToken',
      component: LoginAuthToken,
      meta: {
        descriptiveName: 'Login',
        requiresUnAuthenticated: true
      }
    },
    {
      path: '/email-verification/:token/:email',
      name: 'email-verification',
      component: EmailVerification,
      props: true
    },
    {
      path: '/sign-up/invite',
      component: InviteSignup,
      name: 'invite-signup'
    },
    {
      path: '/sign-up/invite/:organizationSlug',
      component: InviteSignup,
      name: 'invite-signup',
      props: true
    },
    {
      path: '/sign-up/auth-token',
      component: AuthTokenSignup,
      name: 'auth-token-signup'
    },
    {
      path: '/error/:errorCode',
      name: 'error',
      component: ErrorPage,
      props: true
    },
    {
      path: '/',
      component: LayoutLogin,
      meta: { requiresUnAuthenticated: true },
      children: [
        ...AuthRoutes
      ]
    },
    {
      path: '/',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: UserProfile,
          meta: {
            title: 'User Profile',
            descriptiveName: 'Profile'
          }
        },
        {
          path: '/workspace/create',
          name: 'CreateWorkspace',
          component: WorkspaceCreatePage
        },
        {
          path: '/organization/create',
          name: 'CreateOrganizationModeSelect',
          component: OrganizationCreateModeSelectPage
        },
        {
          path: '/organization/create/manual',
          name: 'CreateOrganizationManual',
          component: OrganizationManualCreatePage
        },
        {
          path: '/organization/create/quick',
          name: 'CreateOrganizationQuick',
          component: OrganizationQuickCreatePage
        },
        {
          path: '/administration',
          component: LayoutAdministration,
          meta: { requiresAuth: true },
          children: [
            ...AdministrationRoutes
          ]
        },
        {
          path: '/workspace/:workspaceId',
          component: LayoutWorkspace,
          children: [
            ...WorkspaceRoutes
          ]
        },
        {
          path: ':orgId/:nodeId',
          component: LayoutOrganization,
          children: [
            ...OrganizationRoutes
          ]
        }
      ]
    },
    {
      path: '/',
      component: LayoutBuilder,
      meta: { requiresAuth: true },
      children: [
        {
          path: ':orgId/:nodeId',
          component: LayoutOrganization,
          children: [
            ...BuilderRoutes
          ]
        }
      ]
    },
    {
      path: '/documentation',
      component: documentation,
      name: 'documentation',
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: '/error/404',
      name: 'error-404'
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const vuexStore = store
  if (!vuexStore.getters['auth/isAuthenticated']) {
    // Redirect to login when unauthenticated user
    if (to.matched.some(route => route.meta.requiresAuth)) {
      return next({ name: 'login' })
    } else if (to.path === '/') {
      // This is necessary since auth urls match path `/`
      // so we'll redirect it to login page
      return next({ name: 'login' })
    }
  } else {
    checkPermissions(to, from, next)

    if (to.path === '/') {
      const orgId = Number.parseInt(Ls.getJson('layout.state', {}).organization)
      if (orgId && vuexStore.dispatch['layout/hasOrganization']) {
        // Redirect to appropriate org url
        return next({ name: 'OrganizationHome', params: { orgId: orgId } })
      } else if (!to.name) {
        // Check if `to.name` is undefined, this means that the user
        // visits directly the home page by inputting the url
        // in the address bar.  Checking the name first avoids
        // infinite loop of redirection
        return next({ name: 'home' })
      }
    } else if (to.matched.some(route => route.meta.requiresUnAuthenticated)) {
      // When authenticated, if going to saml-router or auth token login screens, proceed so that user can login with
      // new credentials.
      // Otherwise block and redirect to home page
      if (!(to.path.indexOf('/saml-router') > -1 || to.path.indexOf('/login/auth-token') > -1)) {
        return next({ name: 'home' })
      }
    } else if (to.matched.some(route => route.meta.requiresApiKey)) {
      // If route requires api key, check if workspace has api keys, redirect to api key setup page if not
      return checkWorkspaceApiKey(to, from, next)
    }
  }
  return next()
})

export default router
