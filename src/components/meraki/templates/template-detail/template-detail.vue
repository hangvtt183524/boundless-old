<template lang="pug">
  .template-detail-page.page-content
    v-layout(
      v-if="viewMode === viewModes.main"
      row wrap
    )
      v-flex(xs12 lg3)
        .template-detail-page__section.template-detail-page__category-selection
          .template-detail-page__section__header
            .template-detail-page__category-selection__header__title(
              v-show="!editingName"
            )
              | {{ isExistingTemplate ? template.name : $t('v2.merakiTemplates.newTemplate') }}
            base-text-input.template-detail-page__category-selection__header__name-input(
              v-if="isExistingTemplate"
              v-show="editingName"
              v-model="template.name"
              @enterKeyUp="onNameInputEnter"
            )
            .template-detail-page__category-selection__header__action
              v-icon(
                v-if="isExistingTemplate"
                @click="onNameEditModeIconClick"
              ) {{ editingName ? 'close' : '$vuetify.icons.edit' }}

          .template-detail-page__section__content
            perfect-scrollbar.template-detail-page__section__content__scroll-area
              template-setting-category-list-item(
                v-for="(category, index) of visibleCategories"
                :key="category.key"
                :category="category"
                :selected-section="selectedSection"
                :initially-expanded="index === 0"
                @sectionSelect="onSectionSelect"
              )
      v-flex(xs12 lg9)
        .template-detail-page__section.template-detail-page__template-management
          .template-detail-page__section__header.template-detail-page__template-management__header
            .template-detail-page__template-management__header__back-link-container(
              v-if="isSettingDetailView"
            )
              v-icon.template-detail-page__template-management__header__back-link-container__back-icon(
                @click="onSettingBackClick"
              ) keyboard_backspace
            .template-detail-page__template-management__header__title
              |  {{ (isSettingDetailView && !!settingDetailTitle) ? settingDetailTitle : $t('v2.merakiTemplates.settingCategories.' + selectedSection.key) }}

            .template-detail-page__template-management__header__customizations
              v-tooltip(bottom :color="'#223d70'" light)
                template(v-slot:activator="{ on }")
                  v-icon(
                    v-on="on"
                    @click="onCustomizationsClick"
                  ) dashboard_customize
                span {{ $t('v2.merakiTemplates.customizations') }}

            .template-detail-page__template-management__header__actions
              base-button.base-button--green.template-detail-page__template-management__header__actions__action(
                @click="onSaveClick"
                :disabled="!(isValid && isValueChanged)"
              ) {{ $t('general.saveChanges') }}
              base-button.base-button--blue.template-detail-page__template-management__header__actions__action(
                v-show="activeProductIdentifier !== 'deployment'"
                @click="onDeployClick"
                :disabled="!(isExistingTemplate && !isValueChanged)"
              ) {{ $t('v2.merakiTemplates.deploy') }}
              base-button.base-button--blue--negative.template-detail-page__template-management__header__actions__action(
                @click="onResetClick"
                :disabled="!isValueChanged"
              ) {{ $t('builder.reset') }}

          .template-detail-page__section__content
            perfect-scrollbar.template-detail-page__section__content__scroll-area(
              id="template-detail-content-scroll-area"
            )
              .template-detail-page__section__content__setting-item(
                v-for="setting of selectedSection.settings"
                :key="setting"
              )
                component(
                  v-if="isComponentRenderEnabled(setting)"
                  v-bind:is="settingComponents[setting]"
                  :value="template"
                  :original-value="originalTemplate"
                  :submitted="submitted"
                  :field-suggestions="fieldSuggestions"
                  :customizations="template.customizations"
                  @settingInput="onSettingInput"
                  @itemInput="onSettingItemInput"
                  @itemFieldClear="onSettingItemFieldClear"
                  @detailViewToggle="onSettingDetailViewToggle"
                  @deployStrategyInput="onDeployStrategyInput"
                  @fieldSuggestionInput="onFieldSuggestionInput"
                  @customizationsClick="onSettingCustomizationsClick"
                  :ref="`setting_${setting}`"
                )

    v-layout(
      v-if="viewMode === viewModes.customizations"
      row wrap
    )
      v-flex(xs12)
        template-customizations(
          v-model="template.customizations"
          :template="template"
          :original-template="originalTemplate"
          :field-suggestions="fieldSuggestions"
          :default-setting-filter="defaultCustomizationsSettingFilter"
          @fieldSuggestionInput="onFieldSuggestionInput"
          @backClick="onCustomizationsBackClick"
          @saveClick="onCustomizationsSaveClick"
        )

    .template-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    discard-confirm-modal(
      ref="discardConfirmModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import TemplateSettingCategoryListItem from '../template-setting-category-list-item/template-setting-category-list-item'
import BaseSelect from '@/components/v2/base-select/base-select'
import DiscardConfirmModal from '@/components/v2/discard-confirm-modal/discard-confirm-modal'
import TemplateCustomizations from '../template-customizations/template-customizations'
import NetworkTemplateValidationMixin from '@/mixins/network-template-validation.mixin'
import NetworkTemplateCleanMixin from '@/mixins/network-template-clean.mixin'
import NetworkSettingsPageMixin from '@/mixins/network-settings-page.mixin'
import CurrentProductSelectionsMixin from '@/mixins/current-product-selections.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'template-detail',
  mixins: [
    NetworkTemplateValidationMixin,
    NetworkTemplateCleanMixin,
    NetworkSettingsPageMixin,
    CurrentProductSelectionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    BaseSelect,
    BaseTextInput,
    TemplateSettingCategoryListItem,
    BaseButton,
    DiscardConfirmModal,
    TemplateCustomizations
  },
  props: {
    templateId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      submitted: false,
      template: {},
      originalTemplate: {},
      discardChoices: {
        discard: 'discard',
        saveAndExit: 'saveAndExit',
        back: 'back'
      },
      fieldSuggestions: {},
      viewModes: {
        main: 'main',
        customizations: 'customizations'
      },
      viewMode: 'main',
      defaultCustomizationsSettingFilter: null,
      editingName: false
    }
  },
  mounted () {
    // Select first section by default,
    this.$set(this, 'selectedSection', this.visibleCategories[0].sections[0])

    if (this.templateId) {
      this.fetchTemplate()
    }
  },
  beforeRouteLeave (to, from, next) {
    const templateDetailRouteNames = ['TemplateDetail', 'TemplateCustomizations']

    if (this.isValueChanged && templateDetailRouteNames.indexOf(to.name) === -1) {
      // Show confirmation modal if user tries to leave the page when they have changes made
      this.$refs.discardConfirmModal.open().then(discardChoice => {
        if (discardChoice === this.discardChoices.discard) {
          next()
        } else if (discardChoice === this.discardChoices.saveAndExit) {
          if (!this.isValid) {
            global.toastr['error'](this.$t('general.changesCantBeApplied'), this.$t('general.error'))
            return
          }

          // For valid, try to save changes now
          this.onSaveClick(() => {
            return next()
          })
        }

        // Stay in the page
      })
    } else {
      return next()
    }
  },
  created () {
    window.addEventListener('beforeunload', this.beforeWindowUnload.bind(this))
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeWindowUnload.bind(this))
  },
  computed: {
    isExistingTemplate () {
      return this.template && this.template.id
    },
    isValid () {
      let isValid = true
      return isValid
    },
    isValueChanged () {
      return !_.isEqual(this.template, this.originalTemplate)
    }
  },
  watch: {
    $route: {
      handler: function () {
        this.setViewModeFromRoute()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('workspace/network', ['createMerakiTemplate', 'updateMerakiTemplate', 'fetchMerakiTemplate']),
    fetchTemplate () {
      this.loading = true
      this.fetchMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.templateId
      }).then(response => {
        this.$set(this, 'template', response.data.data)
        this.$set(this, 'originalTemplate', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    createTemplate (successCallback) {
      this.loading = true
      this.createMerakiTemplate({
        workspaceId: this.workspaceId,
        ...this.template
      }).then(response => {
        this.$set(this, 'template', response.data.data)
        this.$set(this, 'originalTemplate', JSON.parse(JSON.stringify(response.data.data)))
        this.submitted = false
        this.editingName = false

        if (successCallback) {
          successCallback()
        }
      }).catch((err) => {
        this.handleSaveError(err)
      }).finally(() => {
        this.loading = false
      })
    },
    updateTemplate (successCallback) {
      this.loading = true
      this.updateMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.template.id,
        ...this.template
      }).then(response => {
        this.$set(this, 'template', response.data.data)
        this.$set(this, 'originalTemplate', JSON.parse(JSON.stringify(response.data.data)))
        this.submitted = false
        this.editingName = false

        global.toastr['success'](this.$t('v2.merakiTemplates.templateUpdateSuccess'), this.$t('general.success'))

        if (successCallback) {
          successCallback()
        }
      }).catch((err) => {
        this.handleSaveError(err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleSaveError (error) {
      // If a bad request error is returned without a known response code translation, display the error information to
      // the user
      const errorData = error.response.data.error
      if (error.response.status === 400) {
        errorData.messages.forEach(messageData => {
          if (!(this.$te(`apiMessages.${messageData.code}`) || this.$te(`apiMessages.withContext.${messageData.code}`))) {
            // No known translation for error code. Display unexpected error info
            global.toastr['error'](
              this.$t('general.unexpectedError') + ' ' + this.$t('general.errorInformation') + ': <br/>' +
              `${messageData.key}: ${messageData.message}`,
              this.$t('general.error')
            )
          }
        })
      }
    },
    onSaveClick (successCallback) {
      // Set submitted flag to true so that we display invalid fields
      this.submitted = true

      // Clean template settings first, i.e removing empty items
      this.clean()

      // Run validations
      if (!this.validate()) {
        return false
      }

      if (this.isExistingTemplate) {
        this.updateTemplate(successCallback)
      } else {
        this.createTemplate(successCallback)
      }

      EventTracker.sendEvent(EVENT_NAMES.FLEXTEMPLATE_SAVED)
    },
    onCustomizationsSaveClick () {
      this.loading = true
      this.updateMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.template.id,
        customizations: this.template.customizations
      }).then(response => {
        this.$set(this.template, 'customizations', response.data.data.customizations)
        this.$set(this.originalTemplate, 'customizations', JSON.parse(JSON.stringify(response.data.data.customizations)))
        this.submitted = false

        global.toastr['success'](this.$t('v2.merakiTemplates.templateCustomizationsUpdateSuccess'), this.$t('general.success'))
      }).catch((err) => {
        this.handleSaveError(err)
      }).finally(() => {
        this.loading = false
      })
    },
    onNameInputEnter () {
      this.loading = true
      this.updateMerakiTemplate({
        workspaceId: this.workspaceId,
        templateId: this.template.id,
        name: this.template.name
      }).then(response => {
        this.$set(this.template, 'name', response.data.data.name)
        this.$set(this.originalTemplate, 'name', response.data.data.name)
        this.submitted = false
        this.editingName = false

        global.toastr['success'](this.$t('v2.merakiTemplates.templateNameUpdateSuccess'), this.$t('general.success'))
      }).catch((err) => {
        this.handleSaveError(err)
      }).finally(() => {
        this.loading = false
      })
    },
    onResetClick () {
      this.$set(this, 'template', JSON.parse(JSON.stringify(this.originalTemplate)))
      this.submitted = false
      this.editingName = false
    },
    onNameEditModeIconClick () {
      if (this.editingName) {
        // If disabling, reset name
        this.template.name = this.originalTemplate.name
      }

      // Toggle state
      this.editingName = !this.editingName
    },
    setViewModeFromRoute () {
      // Get default selected tab depending on user permissions
      switch (this.$router.currentRoute.name) {
        case 'TemplateCustomizations':
          this.viewMode = this.viewModes.customizations
          break
        default:
          this.viewMode = this.viewModes.main
      }
    },
    onCustomizationsClick () {
      this.defaultCustomizationsSettingFilter = null
      this.$router.push({ name: 'TemplateCustomizations', params: { templateId: this.template.id } })
    },
    onCustomizationsBackClick () {
      this.$router.push({ name: 'TemplateDetail', params: { templateId: this.template.id } })
    },
    onDeployClick () {
      this.$router.push({ name: 'TemplateDeployment', params: { templateId: this.template.id } })
    },
    onSettingInput (field, value) {
      this.$set(this.template, field, value)
    },
    onSettingItemInput (item, field, value) {
      this.$set(item, field, value)
    },
    onSettingItemFieldClear (item, fields) {
      fields.forEach(field => {
        delete item[field]
      })
    },
    onDeployStrategyInput (field, value) {
      // true means extend
      if (value) {
        this.$set(this.template, 'settings_to_overwrite',
          (this.template.settings_to_overwrite || []).filter(settingField => settingField !== field))
      } else {
        this.$set(this.template, 'settings_to_overwrite', [...(this.template.settings_to_overwrite || []), field])
      }
    },
    onFieldSuggestionInput (setting, field, suggestions) {
      if (!this.fieldSuggestions[setting]) {
        this.$set(this.fieldSuggestions, setting, {})
      }

      if (!this.fieldSuggestions[setting][field]) {
        this.$set(this.fieldSuggestions[setting], field, [])
      }

      // Append to suggestions
      suggestions.forEach(suggestion => {
        this.fieldSuggestions[setting][field].push(suggestion)
      })
    },
    onSettingCustomizationsClick (setting) {
      this.defaultCustomizationsSettingFilter = setting || null
      this.$router.push({ name: 'TemplateCustomizations', params: { templateId: this.template.id, setting: setting } })
    },
    beforeWindowUnload (event) {
      if (!this.isValueChanged) {
        event.preventDefault()
        return
      }

      // Value changed. Ask for confirmation from user
      event.returnValue = this.$t('general.discardConfirmText')
      return this.$t('general.discardConfirmText')
    }
  }
}
</script>

<style src="./template-detail.scss" lang="scss" scoped></style>
