const Campaigns = () => import(/* webpackChunkName: "marketing" */ '@/components/campaigns/list')
const CampaignDetail = () => import(/* webpackChunkName: "marketing" */ '@/components/campaigns/detail')
const SplashPages = () => import(/* webpackChunkName: "marketing" */ '@/components/splash-pages/list')
const MediaLibrary = () => import(/* webpackChunkName: "marketing" */ '@/components/media-library/index')

export default [
  {
    path: 'marketing/campaigns',
    name: 'Campaigns',
    component: Campaigns,
    meta: {
      title: 'Campaigns',
      descriptiveName: 'Campaign Listing'
    }
  },
  {
    path: 'marketing/campaigns/:campaignId',
    name: 'CampaignDetail',
    component: CampaignDetail,
    props: true,
    meta: {
      title: 'Campaign Detail',
      descriptiveName: 'Campaign Detail'
    }
  },
  {
    path: 'marketing/splash-pages',
    name: 'SplashPages',
    component: SplashPages,
    meta: {
      title: 'Splash Pages',
      descriptiveName: 'Splash Page Templates'
    }
  },
  {
    path: 'marketing/media-library',
    name: 'MediaLibrary',
    component: MediaLibrary,
    meta: {
      title: 'Media Library',
      descriptiveName: 'Media Library'
    }
  }

]
