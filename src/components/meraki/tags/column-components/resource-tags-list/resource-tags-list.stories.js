import { storiesOf } from '@storybook/vue'

import ResourceTagsList from './resource-tags-list'

export const tags = [
  {
    id: 1,
    name: 'Secure',
    use_count: 1
  },
  {
    id: 2,
    name: 'Device',
    use_count: 1
  },
  {
    id: 3,
    name: 'Meraki',
    use_count: 1
  },
  {
    id: 4,
    name: 'Wireless',
    use_count: 1
  },
  {
    id: 5,
    name: 'App',
    use_count: 1
  },
  {
    id: 6,
    name: 'Private',
    use_count: 1
  },
  {
    id: 7,
    name: 'Set-up',
    use_count: 1
  },
  {
    id: 8,
    name: 'Overloaded',
    use_count: 1
  },
  {
    id: 9,
    name: 'Guest',
    use_count: 1
  }
]

storiesOf('ResourceTagsList', module)
  .add('default', () => {
    return {
      components: { ResourceTagsList },
      data () {
        return {
          tags: tags
        }
      },
      template: `<resource-tags-list :value="tags" ></resource-tags-list>`
    }
  })
