import { storiesOf } from '@storybook/vue'

import BaseCheckBox from './base-check-box'

storiesOf('BaseCheckBox', module)
  .add('default', () => {
    return {
      components: { BaseCheckBox },
      template: `<base-check-box label="Item label" ></base-check-box>`
    }
  })
