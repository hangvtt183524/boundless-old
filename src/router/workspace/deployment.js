const NetworkCreationFlowList = () => import(/* webpackChunkName: "monitoring" */ '@/components/meraki/network-creation-flow/network-creation-flow-list/network-creation-flow-list')
const NetworkCreationFlowDetail = () => import(/* webpackChunkName: "monitoring" */ '@/components/meraki/network-creation-flow/network-creation-flow-detail/network-creation-flow-detail')

export default [
    {
        path: 'deployment/network-creation-flow',
        name: 'NetworkCreationFlowList',
        component: NetworkCreationFlowList,
        meta: {
          title: 'Network Creation Flows',
          requiresApiKey: true
        }
      },
      {
        path: 'deployment/network-creation-flow/new',
        name: 'NewNetworkCreationFlow',
        component: NetworkCreationFlowDetail,
        meta: {
          title: 'Create Flow',
          requiresApiKey: true
        }
      },
      {
        path: 'deployment/network-creation-flow/:flowId',
        name: 'NetworkCreationFlowDetail',
        component: NetworkCreationFlowDetail,
        props: (route) => ({
          flowId: route.params.flowId
        }),
        meta: {
          title: 'Execute Flow',
          requiresApiKey: true
        }
      },
]