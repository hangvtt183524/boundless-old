<template lang="pug">
  base-modal(
    class="clone-networks-modal"
    :show="show"
    @close="close"
    max-width="960px"
  )
    template(v-slot:header)
      div.clone-networks-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.clone-networks-modal__title
              | {{ $t('v2.merakiNetworks.cloneSelectedNetworks') }}

    template(v-slot:default)
      div.clone-networks-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            base-table(
              :items="cloneMappings"
              :headers="tableHeaders"
              :actions="tableActions"
              @itemInput="onTableItemInput"
              @actionClick="onTableActionClick"
              always-editable
              generate-keys
              :sortable="false"
            )

    template(v-slot:footer)
      div.clone-networks-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onCloneClick"
              :disabled="!isValid"
            ) {{ $t('v2.merakiNetworks.clone') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.clone-networks-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      job-tracking-modal(
        :persistent="true"
        display-post-run-messages
        :message-info-formatter="jobMessageInfoFormatter"
        ref="jobTrackingModal"
      )

      confirm-modal(
        ref="confirmModal"
      )

      clone-networks-customizations-modal(
        :show="isCustomizationsModalVisible"
        :value="activeMapping ? activeMapping.customizations : null"
        @close="closeCustomizationsModal"
      )

</template>

<script>
import { mapActions } from 'vuex'

import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import BaseTable from '@/components/v2/base-table/base-table'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import NetworkDeploymentScreenMixin from '@/mixins/network-deployment-screen.mixin'
import CloneTargetCell from './column-components/clone-target-cell'
import CloneNetworksCustomizationsModal from './clone-networks-customizations-modal'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    CloneNetworksCustomizationsModal,
    BaseModal,
    JobTrackingModal,
    BaseButton,
    BaseTable,
    ConfirmModal
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    NetworkDeploymentScreenMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    networks: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      cloneMappings: [],
      activeMapping: null,
      isCustomizationsModalVisible: false,
      tableActions: [
        {
          icon: 'dashboard_customize',
          type: 'customize'
        }
      ]
    }
  },

  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('v2.merakiNetworks.sourceNetwork'),
          value: 'source_network_name',
          editable: false,
          width: '150px'
        },
        {
          text: this.$t('v2.merakiNetworks.target'),
          value: 'target_organization',
          cellComponent: CloneTargetCell
        }
      ]
    },
    isValid () {
      return this.cloneMappings.length > 0 && this.cloneMappings.filter(item => {
        return !((item.create_new_network && item.target_organization) || (item.target_network))
      }).length === 0
    }
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },

  methods: {
    ...mapActions('workspace/network', ['cloneMerakiNetworks']),
    onTableItemInput (tableItem, field, value) {
      this.$set(tableItem, field, value)
    },
    onCloneClick () {
      this.$refs.confirmModal.open(
        this.$t('v2.merakiNetworks.confirmCloneTitle'),
        this.$t('v2.merakiNetworks.confirmCloneDescription').replace('{network_count}', this.networks.length)
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.cloneMerakiNetworks({
            workspaceId: this.workspaceId,
            clone_mappings: this.cloneMappings
          }).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.merakiNetworks.confirmCloneTitle'),
              this.$t('v2.merakiNetworks.cloningNetworksDescription').replace('{network_count}', this.networks.length)
            ).then(success => {
              this.loading = false

              this.close(success)
            })

            EventTracker.sendEvent(EVENT_NAMES.MONITORED_NETWORKS_CLONED)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    close (result) {
      this.$emit('close', result)
    },
    onTableActionClick (actionKey, item) {
      if (actionKey === 'customize') {
        this.activeMapping = item
        this.openCustomizationsModal()
      }
    },
    openCustomizationsModal () {
      this.isCustomizationsModalVisible = true
    },
    closeCustomizationsModal (customizations) {
      this.isCustomizationsModalVisible = false

      if (customizations) {
        this.$set(this.activeMapping, 'customizations', customizations)
      }
    },
    resetForm () {
      this.cloneMappings = this.networks.map(network => {
        return {
          source_network: network.network_id,
          source_network_name: network.name,
          target_organization: null,
          target_network: null,
          create_new_network: true,
          new_network_name: network.name,
          customizations: null
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .clone-networks-modal {
    position: relative;

    &__header {

    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      margin-top: 30px;
      min-height: 120px;
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

</style>
