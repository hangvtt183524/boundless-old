<template lang="pug">
  base-modal(
    class="template-creation-modal"
    :show="show"
    :persistent="loading"
    @close="close"
    max-width="540px"
  )
    template(v-slot:header)
      div.template-creation-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.template-creation-modal__title
              | {{ $t('v2.merakiTemplates.newTemplate') }}

    template(v-slot:default)
      div.template-creation-modal__content
        .template-creation-modal__content__source-selection
          base-radio(
            v-model="templateSourceType"
            :radio-value="templateSourceTypes.manual"
            :label="$t('v2.merakiTemplates.blankTemplate')"
          )
          base-radio(
            v-model="templateSourceType"
            :radio-value="templateSourceTypes.fromExisting"
            :label="$t('v2.merakiTemplates.copyFromExisting')"
          )

        .template-creation-modal__content__details
          base-text-input(
            v-model="templateName"
            :label="$t('v2.merakiTemplates.templateName')"
          )
          base-select(
            v-show="templateSourceType === templateSourceTypes.fromExisting"
            :items="organizationOptions"
            v-model="selectedWorkspaceOrganizationId"
            :label="$t('general.organization')"
          )
          base-select(
            v-show="templateSourceType === templateSourceTypes.fromExisting"
            :items="sourceOptions"
            v-model="selectedSource"
            :label="$t('v2.merakiTemplates.source')"
          )

    template(v-slot:footer)
      div.template-creation-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onCreateClick"
              :disabled="!isValid"
            ) {{ $t('general.create') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.template-creation-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseRadio from '@/components/v2/base-radio/base-radio.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'template-creation-modal',
  components: {
    BaseModal,
    BaseTextInput,
    BaseSelect,
    BaseButton,
    BaseRadio
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      loading: false,
      templateSourceTypes: {
        manual: 'manual',
        fromExisting: 'fromExisting'
      },
      templateSourceType: 'manual',
      networkBases: [],
      templateName: null,
      selectedSource: null,
      selectedWorkspaceOrganizationId: null
    }
  },
  computed: {
    ...mapGetters('organization/meraki', ['merakiNetworkBases']),
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    sourceOptions () {
      return [
        {
          key: 'templates',
          name: this.$t('wifi.templates'),
          children: this.networkBases.filter(networkBase => {
            return networkBase.type === 'template'
          }).map(networkBase => {
            return {
              name: networkBase.name,
              key: networkBase.network_id
            }
          }).sort((first, second) => {
            if (first.name > second.name) {
              return 1
            } else if (second.name > first.name) {
              return -1
            }

            return 0
          })
        },
        {
          key: 'networks',
          name: this.$t('wifi.networks'),
          children: this.networkBases.filter(networkBase => {
            return networkBase.type === 'network'
          }).map(networkBase => {
            return {
              name: networkBase.name,
              key: networkBase.network_id
            }
          }).sort((first, second) => {
            if (first.name > second.name) {
              return 1
            } else if (second.name > first.name) {
              return -1
            }

            return 0
          })
        }
      ]
    },
    organizationOptions () {
      return this.userWorkspaceOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })
    },
    isValid () {
      return this.templateName && (this.templateSourceType !== this.templateSourceTypes.fromExisting || this.selectedSource !== null)
    }
  },
  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    },
    selectedWorkspaceOrganizationId (newValue) {
      if (newValue) {
        // On organization selection change, reset selected source and fetch organization networks
        this.$set(this, 'selectedSource', null)

        this.fetchMerakiNetworkBases()
      }
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworkBases']),
    ...mapActions('workspace/network', ['createMerakiTemplate', 'createMerakiTemplateFromSource']),
    fetchMerakiNetworkBases () {
      this.fetchNetworkBases({
        organizationId: this.selectedWorkspaceOrganizationId,
        page_size: 0
      }).then(response => {
        this.$set(this, 'networkBases', response.data.data)
      })
    },
    close () {
      this.$emit('close')
    },
    resetForm () {
      this.$set(this, 'templateName', null)
      this.$set(this, 'selectedSource', null)
      this.$set(this, 'selectedWorkspaceOrganizationId', null)
      this.$set(this, 'templateSourceType', 'manual')
    },
    onCreateClick () {
      if (this.templateSourceType === this.templateSourceTypes.manual) {
        this.createManual()
      } else {
        this.createFomSource()
      }

      EventTracker.sendEvent(EVENT_NAMES.FLEXTEMPLATE_CREATED)
    },
    createManual () {
      this.loading = true
      this.createMerakiTemplate({
        workspaceId: this.workspaceId,
        name: this.templateName
      }).then(response => {
        this.redirectToTemplate(response.data.data.id)
        this.close()
      }).finally(() => {
        this.loading = false
      })
    },
    createFomSource () {
      this.loading = true
      this.createMerakiTemplateFromSource({
        workspaceId: this.workspaceId,
        name: this.templateName,
        source: this.selectedSource
      }).then(response => {
        this.redirectToTemplate(response.data.data.id)
        this.close()
      }).finally(() => {
        this.loading = false
      })
    },
    redirectToTemplate (templateId) {
      this.$router.push({ name: 'TemplateDetail', params: { templateId: templateId } })
    }
  }
}
</script>

<style src="./template-creation-modal.scss" lang="scss" scoped></style>
