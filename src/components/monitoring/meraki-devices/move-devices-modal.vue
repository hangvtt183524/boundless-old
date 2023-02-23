<template lang="pug">
  base-modal(
    class="move-devices-modal"
    :show="show"
    @close="close"
    max-width="540px"
  )
    template(v-slot:header)
      div.move-devices-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.move-devices-modal__title
              | {{ $t('v2.merakiDevices.moveSelectedDevices') }}

    template(v-slot:default)
      div.move-devices-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            label
              | {{ $t('general.organization') }}
            base-select(
              v-model='targetOrganization'
              :items='organizationOptions'
              :search-enabled="true"
            )

          v-flex(xs12)
            label
              | {{ $t('v2.merakiDevices.targetNetwork') }}
            base-select(
              v-model='targetNetwork'
              :items='networkOptions'
              :search-enabled="true"
            )

          v-flex(xs12 mt-3)
            base-check-box(
              v-model="rebootAfterMove"
              :label="$t('v2.merakiDevices.rebootAfterMove')"
            )

        v-layout(
          v-if="switchPortAggregations.length > 0"
          row wrap
        ).move-devices-modal__content__switch-stacks-section
          v-flex(xs12)
            .move-devices-modal__content__switch-stacks-section__description
              | {{ $t('v2.merakiDevices.switchPortAggregationsMoveDescription') }}

            .move-devices-modal__content__switch-stacks-section__label(
              :class="{'move-devices-modal__content__switch-stacks-section__label--inline': switchPortAggregations.length === 1}"
            )
              | {{ switchPortAggregations.length === 1 ? $t('v2.merakiDevices.switchPortAggregation') : $t('v2.merakiDevices.switchPortAggregations') }}:

            .move-devices-modal__content__switch-stacks-section__stacks
              base-check-box(
                v-for="switchPortAggregation of switchPortAggregations"
                :key="switchPortAggregation.id"
                :value="isSwitchPortAggregationSelected(switchPortAggregation)"
                @input="onSwitchPortAggregationSelectionInput(switchPortAggregation, $event)"
                :label="switchPortAggregation.meraki_id"
              )

        v-layout(
          v-if="switchStacks.length > 0"
          row wrap
        ).move-devices-modal__content__switch-stacks-section
          v-flex(xs12)
            .move-devices-modal__content__switch-stacks-section__description
              | {{ $t('v2.merakiDevices.switchStackMoveDescription') }}

            .move-devices-modal__content__switch-stacks-section__label(
              :class="{'move-devices-modal__content__switch-stacks-section__label--inline': switchStacks.length === 1}"
            )
              | {{ switchStacks.length === 1 ? $t('v2.merakiDevices.switchStack') : $t('v2.merakiDevices.switchStacks') }}:

            .move-devices-modal__content__switch-stacks-section__stacks
              base-check-box(
                v-for="switchStack of switchStacks"
                :key="switchStack.id"
                :value="isSwitchStackSelected(switchStack)"
                @input="onSwitchStackSelectionInput(switchStack, $event)"
                :label="switchStack.name"
              )

    template(v-slot:footer)
      div.move-devices-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onMoveClick"
              :disabled="!isValid"
            ) {{ $t('general.move') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.move-devices-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      job-tracking-modal(
        :persistent="true"
        display-post-run-messages
        ref="jobTrackingModal"
      )

      confirm-modal(
        ref="confirmModal"
      )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import _ from 'lodash'

export default {
  components: {
    BaseSelect,
    BaseModal,
    JobTrackingModal,
    BaseTextInput,
    BaseButton,
    BaseCheckBox,
    ConfirmModal
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    devices: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      targetOrganization: null,
      targetNetwork: null,
      networks: [],
      selectedSwitchStacks: [],
      selectedSwitchPortAggregations: [],
      rebootAfterMove: true
    }
  },

  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceMerakiOrganizations () {
      return this.userWorkspaceOrganizations.filter(workspaceOrganization => !!workspaceOrganization.meraki_organization)
    },
    organizationOptions () {
      return this.workspaceMerakiOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })
    },
    networkOptions () {
      return this.networks.map(network => {
        return {
          key: network.id,
          name: network.name
        }
      })
    },
    isValid () {
      return !!this.targetOrganization && !!this.targetNetwork
    },
    targetOrganizationName () {
      if (this.targetOrganization) {
        return this.organizationOptions.find(option => option.key === this.targetOrganization).name
      }

      return ''
    },
    targetNetworkName () {
      if (this.targetNetwork) {
        return this.networkOptions.find(option => option.key === this.targetNetwork).name
      }

      return ''
    },
    switchStacks () {
      return _.uniqBy(this.devices.filter(item => !!item.switch_stack).map(item => item.switch_stack), 'id')
    },
    switchPortAggregations () {
      return _.uniqBy(this.devices.map(item => item.switch_port_aggregations).reduce((previous, current) => {
        return current.concat(previous)
      }, []), 'id')
    },
    effectiveDevices () {
      // List of devices not under any of the selected switch stacks or switch port aggregations
      return this.devices.filter(item =>
        (!item.switch_stack || this.selectedSwitchStacks.indexOf(item.switch_stack.id) === -1) &&
        (this.selectedSwitchPortAggregations.filter(aggregationId =>
          item.switch_port_aggregations.map(aggregation => aggregation.id).includes(aggregationId)).length === 0
        )
      )
    }
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    },
    targetOrganization: {
      handler: function (newValue, oldValue) {
        if (newValue !== oldValue) {
          // Target organization changed.
          // Clear selected network first
          this.targetNetwork = null

          // Fetch networks.
          if (newValue) {
            this.fetchNetworkList()
          }
        }
      }
    }
  },

  methods: {
    ...mapActions('workspace/organization', ['cloneWorkspaceMerakiOrganization']),
    ...mapActions('organization/meraki', ['fetchNetworks']),
    ...mapActions('workspace/network', ['moveDevices']),
    fetchNetworkList () {
      this.loading = true
      this.fetchNetworks({
        organizationId: this.targetOrganization,
        page_size: 0
      }).then(response => {
        this.networks = response.data.data
      }).finally(() => {
        this.loading = false
      })
    },
    isSwitchStackSelected (switchStack) {
      return this.selectedSwitchStacks.indexOf(switchStack.id) > -1
    },
    onSwitchStackSelectionInput (switchStack, value) {
      if (value && !this.isSwitchStackSelected(switchStack)) {
        this.selectedSwitchStacks.push(switchStack.id)
      } else if (!value && this.isSwitchStackSelected(switchStack)) {
        this.selectedSwitchStacks = this.selectedSwitchStacks.filter(switchStackId => switchStackId !== switchStack.id)
      }
    },
    isSwitchPortAggregationSelected (switchPortAggregation) {
      return this.selectedSwitchPortAggregations.indexOf(switchPortAggregation.id) > -1
    },
    onSwitchPortAggregationSelectionInput (switchPortAggregation, value) {
      if (value && !this.isSwitchPortAggregationSelected(switchPortAggregation)) {
        this.selectedSwitchPortAggregations.push(switchPortAggregation.id)
      } else if (!value && this.isSwitchPortAggregationSelected(switchPortAggregation)) {
        this.selectedSwitchPortAggregations = this.selectedSwitchPortAggregations.filter(aggregationId => aggregationId !== switchPortAggregation.id)
      }
    },
    onMoveClick () {
      this.$refs.confirmModal.open(
        this.$t('v2.merakiDevices.confirmMoveTitle'),
        this.$t('v2.merakiDevices.confirmMoveDescription')
          .replace('{organization_name}', this.targetOrganizationName)
          .replace('{network_name}', this.targetNetworkName)
          .replace('{device_count}', this.effectiveDevices.length)
          .replace('{switch_stack_count}', this.selectedSwitchStacks.length)
          .replace('{switch_port_aggregation_count}', this.selectedSwitchPortAggregations.length)
      ).then(confirm => {
        if (confirm) {
          this.loading = true

          const data = {
            meraki_devices: this.effectiveDevices.map(device => device.id),
            meraki_switch_stacks: this.selectedSwitchStacks,
            meraki_switch_port_aggregations: this.selectedSwitchPortAggregations,
            target_network: this.targetNetwork,
            reboot_after_move: this.rebootAfterMove
          }

          data.workspaceId = this.workspaceId
          this.moveDevices(data).then(response => {
            this.$refs.jobTrackingModal.open(
              response.data.data.id,
              this.$t('v2.merakiDevices.confirmMoveTitle'),
              this.$t('v2.merakiDevices.movingDevicesDescription')
                .replace('{organization_name}', this.targetOrganizationName)
                .replace('{network_name}', this.targetNetworkName)
                .replace('{device_count}', this.effectiveDevices.length)
                .replace('{switch_stack_count}', this.selectedSwitchStacks.length)
                .replace('{switch_port_aggregation_count}', this.selectedSwitchPortAggregations.length)
            ).then(success => {
              this.loading = false

              this.close(success)
            })

            EventTracker.sendEvent(EVENT_NAMES.MONITORED_DEVICES_MOVED_TO_NETWORK)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    close (result) {
      this.$emit('close', result)
    },
    resetForm () {
      this.targetOrganization = null
      this.targetNetwork = null
      this.selectedSwitchStacks = []
      this.selectedSwitchPortAggregations = []
      this.rebootAfterMove = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .move-devices-modal {
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
      margin-top: 16px;
      min-height: 120px;

      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
      }

      &__switch-stacks-section {
        margin-top: 30px;

        &__description {
          line-height: 20px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-dark;
          margin-bottom: 20px;
        }

        &__label {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-dark;
          margin-bottom: 10px;

          &--inline {
            margin-right: 10px;
            display: inline-block;
            vertical-align: middle;
          }
        }

        &__stacks {
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
        }

        .base-check-box {
          margin-bottom: 10px;
          vertical-align: middle;
          display: block;
        }
      }
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
