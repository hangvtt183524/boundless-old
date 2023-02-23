const Register = () => import(/* webpackChunkName: "auth" */ '@/components/registration/registration')
const EmailVerificationInfo = () => import(/* webpackChunkName: "auth" */ '@/components/registration/email-verification-info')

const Login = () => import(/* webpackChunkName: "auth" */ '@/components/login/login')
const Login2fa = () => import(/* webpackChunkName: "auth" */ '@/components/login/login-2fa')
const Callback = () => import(/* webpackChunkName: "auth" */ '@/components/login/callback')
const ForgotPassword = () => import(/* webpackChunkName: "auth" */ '@/components/login/forgot-password')
const ResetPassword = () => import(/* webpackChunkName: "auth" */ '@/components/login/reset-password')
const SamlRouter = () => import(/* webpackChunkName: "auth" */ '@/components/login/saml-router')
const LoginOrganizationRouter = () => import(/* webpackChunkName: "auth" */ '@/components/login/login-organization-router')

export default [
  {
    path: '/sign-up',
    name: 'register',
    component: Register,
    meta: {
      descriptiveName: 'Registration'
    }
  },
  {
    path: '/email-verification/pending',
    name: 'EmailVerificationInfo',
    component: EmailVerificationInfo
  },
  {
    path: '/login/2fa',
    name: 'login2fa',
    component: Login2fa
  },
  {
    path: '/login/organization-router',
    name: 'LoginOrganizationRouter',
    component: LoginOrganizationRouter,
    meta: {
      descriptiveName: 'Login SSO'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      descriptiveName: 'Login'
    }
  },
  {
    path: '/login/:organizationSlug',
    name: 'login',
    component: Login,
    props: true
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password/:uidb64/:token',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/saml-router',
    name: 'SamlRouter',
    component: SamlRouter
  }
]
