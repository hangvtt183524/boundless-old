<template lang="pug">
  .single-sign-on-settings-detail
    v-layout(row wrap)
      v-flex(xs1)
      v-flex(xs11)
        v-layout(row wrap)
          v-flex(xs12 lg8)
            v-layout(row wrap)
              v-flex(xs12)
                base-text-input(
                  v-model="formData.login_url"
                  :label="$t('v2.organization.settings.providerLoginUrl')"
                  :validations="loginUrlValidations"
                )
            v-layout(row wrap)
              v-flex(xs12)
                base-text-area(
                  v-model="formData.public_certificate"
                  :label="$t('v2.organization.settings.publicCertificate')"
                  :validations="{ required: true }"
                  :rows="6"
                )

            v-layout(row wrap mt-3)
              v-flex(xs12)
                workspace-detail-role-selection(
                  v-model="formData.role_mappings"
                  :workspace="selectedWorkspace.id"
                  :role-node-types="['workspace']"
                )

            v-layout.single-sign-on-settings-detail__consumer-url-row(row wrap mt-3)
              v-flex(xs12)
                label {{ $t('v2.organization.settings.consumerUrl') }}
                span {{ consumerUrl }}
                v-icon.single-sign-on-settings-detail__consumer-url-row__copy-icon(
                  @click="onCopyConsumerUrlClick()"
                )
                  | fas fa-clipboard
            v-layout.single-sign-on-settings-detail__consumer-url-row(row wrap mt-3)
              v-flex(xs12)
                label {{ $t('v2.workspaces.settings.workspaceSlug') }}
                span {{ selectedWorkspace.slug }}
          v-flex.single-sign-on-settings-detail__actions(xs12 lg4)
            base-button.base-button--green(
              @click="onSaveClick"
              :disabled="!(isValid && isValueChanged)"
            ) {{ $t('general.save') }}
            base-button.base-button--blue--negative(
              @click="onCancelClick"
            ) {{ $t('general.cancel') }}
            base-button.base-button--danger(
              @click="onDeleteClick"
              :disabled="!hasExistingSettings"
            ) {{ $t('general.delete') }}

</template>

<script>
import _ from 'lodash'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import BaseButton from '@/components/v2/base-button/base-button'
import { isValidUrl } from '@/utils/form-fields-validation-rules'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import WorkspaceDetailRoleSelection from '@/components/user/workspace-detail-role-selection'
import copyTextToClipboard from '@/utils/copy-to-clipboard'

export default {
  name: 'single-sign-on-setting-detail',
  components: {
    WorkspaceDetailRoleSelection,
    BaseTextArea,
    BaseButton,
    BaseTextInput
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    provider: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      formData: {
        provider: null,
        login_url: null,
        public_certificate: null,
        role_mappings: []
      },
      originalFormData: {},
      loginUrlValidations: {
        required: true,
        methods: [{
          method: isValidUrl
        }]
      }
    }
  },
  mounted () {
    this.$set(this.formData, 'provider', this.provider.provider)
    this.$set(this.formData, 'login_url', this.provider.login_url)
    this.$set(this.formData, 'public_certificate', this.provider.public_certificate)

    if (this.provider.role_mappings && this.provider.role_mappings.length > 0) {
      this.$set(this.formData, 'role_mappings', this.provider.role_mappings.map(roleMapping => {
        return {
          'role': {
            'id': roleMapping.role
          },
          'node': {
            'id': roleMapping.node
          }
        }
      }))
    }

    this.originalFormData = JSON.parse(JSON.stringify(this.formData))
  },
  computed: {
    rootNode () {
      return this.selectedWorkspace
    },
    consumerUrl () {
      return process.env.VUE_APP_SAML_CONSUMER_URL
    },
    isValid () {
      return !!this.formData.login_url && isValidUrl(this.formData.login_url) && !!this.formData.public_certificate
    },
    isValueChanged () {
      return !_.isEqual(this.formData, this.originalFormData)
    },
    hasExistingSettings () {
      return !!this.provider.login_url && !!this.provider.public_certificate
    }
  },
  methods: {
    onSaveClick () {
      this.$emit('saveClick', this.formData)
    },
    onCancelClick () {
      this.$emit('cancelClick')
    },
    onDeleteClick () {
      this.$emit('deleteClick', this.formData.provider)
    },
    onCopyConsumerUrlClick () {
      copyTextToClipboard(this.consumerUrl).then(() => {
        global.toastr['success'](this.$t('general.urlCopied'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .single-sign-on-settings-detail {
    &__consumer-url-row {
      label {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 41px;
        color: $text-medium;
        display: block;
      }

      &__copy-icon {
        margin-left: 10px;
        font-size: 16px;
        color: $blue-medium;
        cursor: pointer;
      }
    }

    &__actions {
      text-align: right;
      padding-top: 40px;

      .base-button {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }

    ::v-deep .organization-detail-role-selection {
      &__roles-table {
        max-width: none;
      }
    }
  }

</style>
