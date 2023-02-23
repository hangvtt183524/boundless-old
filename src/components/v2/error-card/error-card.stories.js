import { storiesOf } from '@storybook/vue'

import ErrorCard from './error-card.vue'

storiesOf('ErrorCard', module)
  .add('basic', () => {
    return {
      components: { ErrorCard },
      data: function () {
        return {
          show: true
        }
      },
      template: `<error-card title="Following errors occurred:" :show="show" @closeClick="onCloseClick" >
        <template slot="content">
          <div>First error</div>
          <div>Second error</div>
        </template>
      </error-card>`,
      methods: {
        onCloseClick () {
          this.show = false
        }
      }
    }
  })
