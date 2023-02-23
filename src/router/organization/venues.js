const VenuesList = () => import(/* webpackChunkName: "venues" */ '@/components/venues/list')
const SiteGroupDetail = () => import(/* webpackChunkName: "venues" */ '@/components/venues/group-details')

export default [
  {
    path: 'venues',
    name: 'Venues',
    component: VenuesList,
    meta: {
      nodeRoles: ['organization'],
      title: 'Venues',
      descriptiveName: 'Venue Listing'
    }
  },
  {
    path: 'venues/detail',
    name: 'SiteGroupDetail',
    component: SiteGroupDetail,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Venues Detail',
      descriptiveName: 'Venue Detail'
    }
  }
]
