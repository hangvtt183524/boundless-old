<template lang="pug">
  .network-creation-flow-detail-page.page-content
    .network-creation-flow-detail-page__header
      .network-creation-flow-detail-page__header__back-link-container
        v-icon.network-creation-flow-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace

      .network-creation-flow-detail-page__header__tab-headers
        base-tab-header(
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.configuration}]"
          @click="onTabHeaderClick(tabs.configuration)"
        ) {{ $t('v2.securityCompliance.configuration') }}
        base-tab-header(
          v-if="isExecuted"
          :class="['tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.executions}]"
          @click="onTabHeaderClick(tabs.executions)"
        ) {{ $t('v2.merakiNetworkCreation.executions') }}

      .network-creation-flow-detail-page__header__actions
        base-button.base-button--green.network-creation-flow-detail-page__header__actions__action(
          @click="onExecuteClick"
          :disabled="!(isExistingFlow && isValid)"
        )
          | {{ $t('v2.merakiNetworkCreation.execute') }}

    .network-creation-flow-detail-page__content
      .network-creation-flow-detail-page__content__tab.network-creation-flow-detail-page__content__tab--executions-tab(
        v-show="selectedTab === tabs.executions"
      )
        v-layout(row wrap)
          v-flex(xs6 md3 lg2 xl1)
            base-select(
              :items="executionOptions"
              v-model="selectedExecutionId"
              :label="$t('v2.merakiNetworkCreation.execution')"
            )

        network-creation-flow-execution-summary.execution-summary(
          v-if="selectedExecution"
          :execution="selectedExecution"
          :workspace-id="workspaceId"
          @inputFileDownloadClick="downloadInputFile(selectedExecution.id)"
        )

      .network-creation-flow-detail-page__content__tab(
        v-show="selectedTab === tabs.configuration"
      )
        .network-creation-flow-detail-page__content__section.upload-section(
          v-if="!isExistingFlow"
        )
          .flow-description
            | {{ $t('v2.merakiNetworkCreation.merakiNetworkCreationDescription') }}
          v-dropzone(
            :options="dropZoneOptions"
            @file-added="onFileAdd"
            ref="fileDropZone"
          )
          a.upload-section__sample-file-download-trigger(
            :href="require(`@/assets/samples/networks-sample.csv`)"
          ) {{ $t('v2.merakiNetworkCreation.downloadSampleCsvFile') }}

        .network-creation-flow-detail-page__content__section.configuration-section(
          v-if="isExistingFlow"
        )
          .download-link(
            @click="downloadInputFile()"
          ) {{ $t('v2.merakiNetworkCreation.downloadInputFile') }}

          .step-description(
            v-if="!isExecuted"
          )
            | {{ $t('v2.merakiNetworkCreation.merakiNetworkCreationStepDescription') }}

          .step-list(
            ref="stepList"
          )
            network-creation-flow-step(
              :class="{'dynamic-step': !isStepFixed(flowStep)}"
              v-for="flowStep of flow.steps"
              :key="getStepKey(flowStep)"
              :value="flowStep"
              @input="onStepInput($event, flowStep.order)"
              :columns="columns"
              :is-fixed="isStepFixed(flowStep)"
              :disabled="isExecuted"
              @removeClick="onStepRemoveClick(flowStep)"
            )

          base-button.base-button--blue.add-step-button(
            v-if="!isExecuted"
            @click="onAddStepClick"
          )
            | {{ $t('v2.merakiNetworkCreation.addStep') }}

    .network-creation-flow-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    network-creation-flow-execution-modal(
      :show="isExecutionModalVisible"
      @close="closeExecutionModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import VDropzone from '@/components/common/v-dropzone'
import NetworkCreationFlowStep from '../network-creation-flow-step/network-creation-flow-step'
import NetworkCreationFlowExecutionSummary from '../network-creation-flow-execution-summary/network-creation-flow-execution-summary'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header'
import Sortable from 'sortablejs/modular/sortable.complete.esm'
import BaseSelect from '@/components/v2/base-select/base-select'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import NetworkCreationFlowExecutionModal
  from '../network-creation-flow-execution-modal/network-creation-flow-execution-modal'

export default {
  name: 'network-creation-flow-detail',
  components: {
    NetworkCreationFlowExecutionModal,
    BaseSelect,
    NetworkCreationFlowExecutionSummary,
    NetworkCreationFlowStep,
    BaseButton,
    BaseTabHeader,
    VDropzone
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    flowId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      tabs: {
        configuration: 'configuration',
        executions: 'executions'
      },
      selectedTab: 'configuration',
      selectedExecutionId: null,
      flow: {},
      originalFlow: {},
      columns: [],
      dropZoneOptions: {
        acceptedFiles: '.csv, .xls, .xlsx',
        url: '/api/mock/url/',
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> ' + this.$t('general.csvXlsFileUpload'),
        autoProcessQueue: false // Do not upload automatically
      },
      stepKeys: new WeakMap(),
      currentStepKey: 0,
      isExecutionModalVisible: false,
      executionParameters: null
    }
  },
  mounted () {
    this.fetchNetworkCreationSteps()

    if (this.flowId) {
      this.fetchCurrentFlow()
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiNetworkCreationSteps']),
    isExistingFlow () {
      return !!this.flow && !!this.flow.id
    },
    isValid () {
      let isValid = true

      // Check that all required steps are added
      const requiredStepIds = this.merakiNetworkCreationSteps.filter(step => {
        return step.is_required === true
      }).map(step => {
        return step.id
      })

      const addedStepIds = this.flow.steps.map(step => {
        return step.step
      })

      if (requiredStepIds.filter(requiredStepId => {
        return addedStepIds.indexOf(requiredStepId) === -1
      }).length > 0) {
        isValid = false
        return isValid
      }

      // Go over added steps to perform step-evel validations
      for (let i = 0; i < this.flow.steps.length; i++) {
        const flowStep = this.flow.steps[i]

        // Check that step type is selected for all added steps
        if (!flowStep.step) {
          isValid = false
          break
        }

        // check that a value is set for all step fields
        if (flowStep.fields.filter(field => {
          return field.value === null
        }).length > 0) {
          isValid = false
          break
        }

        // Check that all required fields are set for all added steps
        const stepDefinition = this.merakiNetworkCreationSteps.filter(step => {
          return step.id === flowStep.step
        })[0]
        if (!stepDefinition) {
          isValid = false
          break
        }

        const stepRequiredFieldIds = stepDefinition.fields.filter(field => {
          return field.is_required === true
        }).map(field => {
          return field.id
        })

        const flowStepFieldIds = flowStep.fields.map(field => {
          return field.field
        })

        if (stepRequiredFieldIds.filter(requiredFieldId => {
          return flowStepFieldIds.indexOf(requiredFieldId) === -1
        }).length > 0) {
          isValid = false
          break
        }
      }

      return isValid
    },
    isValueChanged () {
      return !_.isEqual(this.flow, this.originalFlow)
    },
    executions () {
      return this.flow && this.flow.executions ? this.flow.executions : []
    },
    isExecuted () {
      return this.executions.length > 0
    },
    executionOptions () {
      return this.executions.map(execution => {
        return {
          key: execution.id,
          name: dateTimeFormatter(execution.created_at)
        }
      })
    },
    selectedExecution () {
      return this.executions.find(execution => {
        return execution.id === this.selectedExecutionId
      })
    }
  },
  watch: {
    isExistingFlow: {
      handler: function () {
        if (this.isExistingFlow && !this.isExecuted) {
          // Initialize sortable functionality of steps
          window.setTimeout(function () {
            Sortable.create(
              this.$refs.stepList,
              {
                draggable: '.dynamic-step',
                handle: '.drag-handle',
                onEnd: this.onDragSortEnd
              }
            )
          }.bind(this), 100)
        }
      }
    },
    isExecuted: {
      handler: function (newValue, oldValue) {
        if (!oldValue && newValue) {
          // Switching to executed state, open executions tab
          this.selectedTab = this.tabs.executions
        }
      }
    },
    executions: {
      handler: function (newValue) {
        if (newValue && newValue.length > 0) {
          // When executions list change, select the latest execution automatically
          this.selectedExecutionId = this.executions[0].id
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['createMerakiNetworkCreationFlow', 'updateMerakiNetworkCreationFlow',
      'executeMerakiNetworkCreationFlow', 'fetchMerakiNetworkCreationFlow', 'fetchMerakiNetworkCreationSteps',
      'fetchMerakiNetworkCreationFlowColumns', 'downloadMerakiNetworkCreationFlowInputFile']),
    getStepKey (step) {
      // Returns a unique key for each row. Required for drag - sort
      if (!this.stepKeys.has(step)) {
        this.stepKeys.set(step, ++this.currentStepKey)
      }

      return this.stepKeys.get(step)
    },
    fetchNetworkCreationSteps () {
      this.fetchMerakiNetworkCreationSteps({
        workspaceId: this.workspaceId,
        page_size: 0
      }).then(() => {
        this.addDefaultSteps()
      })
    },
    fetchCurrentFlow () {
      this.loading = true
      this.fetchMerakiNetworkCreationFlow({
        workspaceId: this.workspaceId,
        flowId: this.flowId
      }).then(response => {
        this.$set(this, 'flow', response.data.data)
        this.$set(this, 'originalFlow', JSON.parse(JSON.stringify(response.data.data)))

        this.addDefaultSteps()

        // Fetch columns
        this.fetchCurrentFlowColumns()
      }).finally(() => {
        this.loading = false
      })
    },
    fetchCurrentFlowColumns () {
      this.fetchMerakiNetworkCreationFlowColumns({
        workspaceId: this.workspaceId,
        flowId: this.flow.id
      }).then(response => {
        this.$set(this, 'columns', response.data.data.results)
      })
    },
    onFileAdd (file) {
      const formData = new FormData()
      formData.append('file', file)

      this.loading = true
      this.createMerakiNetworkCreationFlow({
        workspaceId: this.workspaceId,
        formData: formData
      }).then(response => {
        this.$set(this, 'flow', response.data.data)
        this.$set(this, 'originalFlow', JSON.parse(JSON.stringify(response.data.data)))

        this.addDefaultSteps()

        // Fetch columns
        this.fetchCurrentFlowColumns()
      }).finally(() => {
        this.loading = false
      })
    },
    updateFlow (execute) {
      this.loading = true
      this.updateMerakiNetworkCreationFlow({
        workspaceId: this.workspaceId,
        flowId: this.flow.id,
        steps: this.flow.steps
      }).then(response => {
        this.$set(this, 'flow', response.data.data)
        this.$set(this, 'originalFlow', JSON.parse(JSON.stringify(response.data.data)))

        if (execute) {
          this.executeFlow()
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    executeFlow () {
      const formData = new FormData()
      formData.append('targets', this.executionParameters.targets.join(','))

      if (this.executionParameters.file) {
        formData.append('file', this.executionParameters.file)
      }

      this.loading = true
      this.executeMerakiNetworkCreationFlow({
        workspaceId: this.workspaceId,
        flowId: this.flow.id,
        formData: formData
      }).then(response => {
        // Add execution item to the list of flow executions
        this.flow.executions.splice(0, 0, response.data.data)
        this.originalFlow.executions.splice(0, 0, response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    onExecuteClick () {
      this.openExecutionModal()
    },
    openExecutionModal () {
      this.isExecutionModalVisible = true
    },
    closeExecutionModal (executionParameters) {
      if (executionParameters) {
        // If execution parameters are returned, start execution process
        this.$set(this, 'executionParameters', executionParameters)

        if (this.isValueChanged) {
          this.updateFlow(true)
        } else {
          this.executeFlow()
        }
      }

      this.isExecutionModalVisible = false
    },
    downloadInputFile (executionId) {
      const data = {
        workspaceId: this.workspaceId,
        flowId: this.flow.id
      }

      if (executionId) {
        data.execution = executionId
      }

      this.downloadMerakiNetworkCreationFlowInputFile(data)
    },
    addDefaultSteps () {
      // Adds required steps by default
      if (this.flow.steps && this.flow.steps.length === 0) {
        this.merakiNetworkCreationSteps.filter(step => {
          return step.is_required === true
        }).forEach((step, index) => {
          this.flow.steps.push({
            step: step.id,
            order: index,
            fields: []
          })
        })
      }
    },
    onStepInput (stepData, order) {
      const stepItem = this.flow.steps.filter(step => {
        return step.order === order
      })[0]

      Object.keys(stepData).forEach((key, index) => {
        this.$set(stepItem, key, stepData[key])
      })
    },
    isStepFixed (flowStep) {
      // A step is fixed if is is required and if tis is first occurrence of its type
      const stepDefinition = this.merakiNetworkCreationSteps.filter(step => {
        return step.id === flowStep.step
      })[0]
      if (!stepDefinition) {
        return false
      }

      return stepDefinition.is_required && this.flow.steps.filter(stepItem => {
        return stepItem.step === flowStep.step && stepItem.order < flowStep.order
      }).length === 0
    },
    fixStepOrders () {
      this.flow.steps.forEach((step, index) => {
        step.order = index
      })
    },
    onStepRemoveClick (flowStep) {
      this.$set(this.flow, 'steps', this.flow.steps.filter(step => {
        return step.order !== flowStep.order
      }))

      this.fixStepOrders()
    },
    onAddStepClick () {
      this.flow.steps.push({
        step: null,
        fields: []
      })

      this.fixStepOrders()
    },
    onDragSortEnd: function ({ oldIndex, newIndex }) {
      let steps = _.clone(this.flow.steps)

      // Now move the items in this array
      const movedItem = steps.splice(oldIndex, 1)[0]
      steps.splice(newIndex, 0, movedItem)

      this.$set(this.flow, 'steps', steps)
      this.fixStepOrders()
    },
    onBackClick () {
      this.$router.go(-1)
    },
    onTabHeaderClick: function (tabKey) {
      this.selectedTab = tabKey
    }
  }
}
</script>

<style src="./network-creation-flow-detail.scss" lang="scss" scoped></style>
