import { storiesOf } from '@storybook/vue'

import DatePicker from './date-picker.vue'

storiesOf('DatePicker', module)
  .add('default', () => {
    return {
      components: { DatePicker },
      template: `<date-picker></date-picker>`
    }
  })
