import { storiesOf } from '@storybook/vue'
import i18n from '../../../plugins/i18n/i18n'
import MultiAction from './multi-action.vue'

const actions = [
  {
    key: 'create',
    label: 'Create'
  },
  {
    key: 'update',
    label: 'Update'
  }
]

storiesOf('MultiAction', module)
  .add('blue', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--blue" :actions="actions"></multi-action></div>`,
      i18n
    }
  })
  .add('blue-negative', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--blue--negative" :actions="actions"></multi-action></div>`,
      i18n
    }
  })
  .add('green', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--green" :actions="actions"></multi-action></div>`,
      i18n
    }
  })
  .add('green-negative', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--green--negative" :actions="actions"></multi-action></div>`,
      i18n
    }
  })
  .add('small', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--blue multi-action--small" :actions="actions"></multi-action></div>`,
      i18n
    }
  })
  .add('disabled', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--blue" :actions="actions" :disabled="true"></multi-action></div>`,
      i18n
    }
  })
  .add('negative-disabled', () => {
    return {
      components: { MultiAction },
      data: function () {
        return {
          actions: actions
        }
      },
      template: `<div style="width: 180px;"><multi-action class="multi-action--blue--negative" :actions="actions" :disabled="true"></multi-action></div>`,
      i18n
    }
  })
