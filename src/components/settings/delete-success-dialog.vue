<template lang="pug">
  base-dialog(
    :show="show"
    :persistent="true"
    :hide-close-btn="true"
    max-width="500"
  )
    v-flex(xs12)
      v-alert(
        :value="true"
        type="success"
      )
        strong
          | {{ successMessage ? successMessage : $t('organization.organizationDeletedSuccessMessage') }}.
    v-flex(xs12 pt-4 class="text-xs-center")
      a(
        @click="redirect"
      ) {{ $t('general.clickHereToContinue') }}

    v-flex(xs12 py-4 class="text-xs-center")
      | {{ redirectMessage ? redirectMessage : $t('organization.organizationDeleteRedirectMessage') }}

      interval-progress(
        v-if="show"
        :increment="20"
        @finish="redirect"
      )
</template>

<script>
import BaseDialog from '@/components/common/base-dialog'
import IntervalProgress from '@/components/common/interval-progress'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    successMessage: {
      type: String,
      required: false
    },
    redirectMessage: {
      type: String,
      required: false
    }
  },
  components: {
    BaseDialog,
    IntervalProgress
  },
  methods: {
    redirect () {
      window.location = '/'
    }
  }
}
</script>
