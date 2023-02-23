import { storiesOf } from '@storybook/vue'

import SimilarTags from './similar-tags'

export const similarTags = [
  {
    id: 1,
    name: 'Secuure',
    use_count: 1
  },
  {
    id: 2,
    name: 'Secured',
    use_count: 1
  }
]

storiesOf('SimilarTags', module)
  .add('default', () => {
    return {
      components: { SimilarTags },
      data () {
        return {
          similarTags: similarTags
        }
      },
      template: `<similar-tags :value="similarTags" ></similar-tags>`
    }
  })
