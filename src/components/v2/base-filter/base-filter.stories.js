import { storiesOf } from '@storybook/vue'

import BaseFilter from './base-filter'

export const filterItems = {
  id: 1,
  name: 'Devices',
  ssids: [
    {
      id: 1,
      name: 'Switches - MS'
    },
    {
      id: 2,
      name: 'Routers - MR'
    },
    {
      id: 3,
      name: 'Security - MX'
    },
    {
      id: 4,
      name: 'Cameras - MV'
    }
  ]
}

storiesOf('BaseFilter', module).add('default', () => {
  return {
    components: { BaseFilter },
    data () {
      return {
        filterItems: filterItems
      }
    },
    template: `<div style="width: 160px;"><base-filter v-model="filterItems" ></base-filter></div>`
  }
})
