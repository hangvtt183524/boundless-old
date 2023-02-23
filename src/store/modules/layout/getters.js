export const userWorkspaces = (state) => state.userWorkspaces
export const userWorkspaceOrganizations = (state) => state.userWorkspaceOrganizations
export const userOrganizationNodes = (state) => state.userOrganizationNodes
export const selectedWorkspace = (state) => state.selectedWorkspace
export const selectedOrganization = (state) => state.selectedOrganization
export const selectedNode = (state) => state.selectedNode
export const userWorkspaceOrganizationsFetched = (state) => state.userWorkspaceOrganizationsFetched
export const selectedWorkspaceDataFetched = (state) => state.selectedWorkspaceDataFetched
export const selectedOrganizationDataFetched = (state) => state.selectedOrganizationDataFetched
export const selectedNodeDataFetched = (state) => state.selectedNodeDataFetched
export const hasWorkspaces = (state) => state.userWorkspaces.length > 0
export const hasOrganizations = (state) => state.userWorkspaceOrganizations.length > 0
export const activeProductIndex = (state) => state.activeProductIndex
export const menu = (state) => state.menu
export const toolbarMenu = (state) => state.toolbarMenu
