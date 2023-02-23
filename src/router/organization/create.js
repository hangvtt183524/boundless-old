const NewOrganization = () => import(/* webpackChunkName: "org-create" */ '@/components/organization/new/new')
const NewOrganizationStep1 = () => import(/* webpackChunkName: "org-create" */ '@/components/organization/new/new-step1')
const NewOrganizationStep2 = () => import(/* webpackChunkName: "org-create" */ '@/components/organization/new/new-step2')

export default [
  {
    path: '/organization/new',
    name: 'NewOrganization',
    component: NewOrganization
  },
  {
    path: '/organization/new/step1',
    name: 'NewOrganizationStep1',
    component: NewOrganizationStep1
  },
  {
    path: '/organization/new/step2',
    name: 'NewOrganizationStep2',
    component: NewOrganizationStep2
  }
]
