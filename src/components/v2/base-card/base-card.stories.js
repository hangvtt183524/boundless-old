import { storiesOf } from '@storybook/vue'

import BaseCard from './base-card.vue'
import { action } from '@storybook/addon-actions'

storiesOf('BaseCard', module)
  .add('card-small', () => {
    return {
      components: { BaseCard },
      template: `<div style="width: 320px"><base-card class="base-card--small" :title="'Card Title'" :text="'This is the card text'" @selectionChange="action"></base-card></div>`,
      methods: { action: action('selectionChange') }
    }
  })
  .add('card-small-with-icon', () => {
    return {
      components: { BaseCard },
      template: `<div style="width: 320px"><base-card class="base-card--small" :title="'Card Title'" :text="'This is the card text'" :icon="'edit'" @selectionChange="action"></base-card></div>`,
      methods: { action: action('selectionChange') }
    }
  })
  .add('card-horizontal', () => {
    return {
      components: { BaseCard },
      template: `<base-card class="base-card--horizontal" :title="'Card Title'" :text="'This is the card text'" @selectionChange="action"></base-card>`,
      methods: { action: action('selectionChange') }
    }
  })
  .add('card-horizontal-with-icon', () => {
    return {
      components: { BaseCard },
      template: `<base-card class="base-card--horizontal" :title="'Card Title'" :text="'This is the card text'" :icon="'edit'" @selectionChange="action"></base-card>`,
      methods: { action: action('selectionChange') }
    }
  })
