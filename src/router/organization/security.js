const OrganizationSecurity = () => import(/* webpackChunkName: "org-security" */ '@/components/organization/security')

export default [
  {
    path: 'security',
    name: 'OrganizationSecurity',
    component: OrganizationSecurity,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Boundless Security'
    }
  }
]
