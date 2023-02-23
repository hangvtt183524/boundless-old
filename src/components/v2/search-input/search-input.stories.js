import { storiesOf } from '@storybook/vue'

import SearchInput from './search-input.vue'

storiesOf('SearchInput', module)
  .add('default', () => {
    return {
      components: { SearchInput },
      template: `<search-input placeholder="Search" ></search-input>`
    }
  })
