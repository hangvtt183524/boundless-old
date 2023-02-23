<template lang="pug">
  base-modal(
    class="network-creation-flow-execution-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.network-creation-flow-execution-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.network-creation-flow-execution-modal__title
              | {{ $t('v2.merakiNetworkCreation.openExecutionModal') }}

    template(v-slot:default)
      div.network-creation-flow-execution-modal__content
        v-layout.network-creation-flow-execution-modal__content__input-row(row wrap)
          v-flex(xs12)
            .network-creation-flow-execution-modal__content__input-row__description
              | {{ $t('v2.merakiNetworkCreation.executionFileDescription') }}
            base-file-input(
              v-model="file"
              accept=".csv,.xls,.xlsx"
            )

        v-layout.network-creation-flow-execution-modal__content__input-row(row wrap)
          v-flex(xs12)
            .network-creation-flow-execution-modal__content__input-row__description
              | {{ $t('v2.merakiTemplates.targets') }}
            base-multi-select(
              :items="organizationOptions"
              v-model="targets"
            )

    template(v-slot:footer)
      div.network-creation-flow-execution-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onExecuteClick"
              :disabled="!isValid"
            ) {{ $t('v2.merakiNetworkCreation.execute') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.network-creation-flow-execution-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )
</template>

<script>
import { mapGetters } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseFileInput from '@/components/v2/base-file-input/base-file-input.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'

export default {
  components: {
    BaseMultiSelect,
    BaseFileInput,
    BaseModal,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'organization'
    }
  },

  data () {
    return {
      loading: false,
      file: null,
      targets: []
    }
  },

  mounted () {
    this.initializeTargets()
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },

  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    isValid () {
      return this.targets.length > 0
    },
    organizationOptions () {
      return this.userWorkspaceOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },
    initializeTargets () {
      if (this.mode === this.modes.organization) {
        // For organizatio mode, directly set current organization as deployment target
        this.targets = [this.organizationId]
      } else {
        this.targets = []
      }
    },
    resetForm () {
      this.file = null

      this.initializeTargets()
    },
    onOrganizationOptionSelect (option) {
      this.selectedOrganizationOption = option
    },
    onExecuteClick () {
      this.$emit('close', {
        targets: this.targets,
        file: this.file
      })
    }
  }
}
</script>

<style src="./network-creation-flow-execution-modal.scss" lang="scss" scoped></style>\
