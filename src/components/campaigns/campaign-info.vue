<template lang="pug">
  panel-container(
    :readonly="readonly"
    :title="$t('general.generalInformation')"
  )
    v-layout(row wrap)
      v-flex(xs12 md6 px-2)
        node-name-input(
          :label="$t('general.name')"
          :max-length="32"
          :error-messages="getVueErrors('value.name')"
          :readonly="readonly"
          placeholder="--"
          required
          v-model="value.name"
          @input="$v.value.name.$touch()",
          @blur="$v.value.name.$touch()"
        )
      v-flex(xs12 md6 px-2)
        v-select(
          :readonly="readonly"
          :items="splashPages"
          :label="$t('general.splashPage')"
          required
          item-text="name"
          item-value="id"
          v-model="value.splashpage"
        )
      v-flex(xs12 md6 px-2)
        node-select(
          :readonly="readonly"
          :indent-level="0"
          :node-types="['organization', 'group', 'site']"
          :label="$t('general.siteGroup')"
          v-model="value.node"
        )
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

import PanelContainer from '@/components/common/panel-container'
import NodeSelect from '@/components/common/node-select'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  mixins: [
    CurrentUserMixin,
    ErrorHandlerMixin,
    ManageableNodesMixin
  ],
  components: {
    PanelContainer,
    NodeSelect
  },
  mounted () {
    this.fetchSplashPages({ orgId: this.orgId, published: 'True', page_size: 0 })
  },
  validations: {
    value: {
      name: {
        required,
        maxLength: maxLength(32)
      },
      splashpage: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('organization', ['splashPages']),
    orgId () {
      return this.$route.params.orgId
    }
  },
  methods: {
    ...mapActions('organization', ['fetchSplashPages']),
    isValid () {
      return !this.$v.value.$invalid
    }
  }
}
</script>
