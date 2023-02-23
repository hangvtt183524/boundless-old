import { storiesOf } from '@storybook/vue'

import BaseButton from './base-button.vue'
import { action } from '@storybook/addon-actions'

storiesOf('BaseButton', module)
  .add('green', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--green" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-disabled', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--green" disabled="true" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-negative', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--green--negative" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-negative-disabled', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--green--negative" disabled="true" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-loading', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--green" @click="action" :loading="true">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--blue" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-disabled', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--blue" disabled="true" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-negative', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--blue--negative" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-negative-disabled', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--blue--negative" disabled="true" @click="action">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-loading', () => {
    return {
      components: { BaseButton },
      template: `<base-button class="base-button--blue" @click="action" :loading="true">Submit</base-button>`,
      methods: { action: action('clicked') }
    }
  })
