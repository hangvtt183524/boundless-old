const env = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : `${window.location.origin}/`

export default {
  apiUrlBase: '/',
  appTitle: 'Boundless',
  appTitleShort: 'Ivi',
  appDescription: 'An ES6 Vue.js client',
  env,
  loadDbName: 'boundlessLocalDB',
  // genericCachingTime: 864e5,
  genericCachingTime: 0
}
