import { storiesOf } from '@storybook/vue'

import BaseTabHeader from './base-tab-header.vue'
import { action } from '@storybook/addon-actions'

storiesOf('BaseTabHeader', module)
  .add('green', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--green" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-active', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--green tab-header--active" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-underlined-active', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--underlined tab-header--green tab-header--active" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('green-disabled', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--green" disabled="true" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--blue" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-active', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--blue tab-header--active" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-underlined-active', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--underlined tab-header--blue tab-header--active" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
  .add('blue-disabled', () => {
    return {
      components: { BaseTabHeader },
      template: `<base-tab-header class="tab-header--blue" disabled="true" @click="action">Submit</base-tab-header>`,
      methods: { action: action('clicked') }
    }
  })
