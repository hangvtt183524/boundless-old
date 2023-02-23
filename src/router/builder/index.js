const Index = () => import(/* webpackChunkName: "builders" */ '@/components/splash-page-builder/index')

export default [
  {
    path: 'page-builder/:splashId',
    name: 'SplashPageBuilder',
    component: Index
  }
]
