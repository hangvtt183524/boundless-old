<template lang="pug">
  base-modal(
    class="deployment-target-new-networks-modal"
    :show="show"
    @close="close"
    max-width="430px"
  )
    template(v-slot:header)
      div.deployment-target-new-networks-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.deployment-target-new-networks-modal__title
              | {{ $t('v2.merakiCommon.createNewNetworks') }}

    template(v-slot:default)
      div.deployment-target-new-networks-modal__content
        v-layout(row wrap)
          v-flex(
            xs12
            v-if="organizationChoices && organizationChoices.length > 1"
          )
            label
              | {{ $t('v2.merakiTemplates.selectOrganization') }}
            base-select(
              v-model="selectedOrganization"
              :items="organizationOptions"
            )

          v-flex(xs12)
            label
              | {{ $t('v2.merakiCommon.networkNames') }}

            .deployment-target-new-networks-modal__content__organization-row(
              v-for="(networkName, index) of networkNames"
            )
              v-layout(row wrap)
                v-flex(xs8 lg9)
                  base-text-input(
                    :value="networkName"
                    @input="onNetworkNameInput($event, index)"
                  )
                v-flex(xs4 lg3).deployment-target-new-networks-modal__content__organization-row__actions
                  v-icon.deployment-target-new-networks-modal__content__organization-row__actions__action(
                    v-if="networkNames.length > 1"
                    @click="onRemoveNetworkClick(index)"
                  ) close

                  v-icon.deployment-target-new-networks-modal__content__organization-row__actions__action(
                    v-if="index === networkNames.length - 1"
                    @click="onAddNetworkClick"
                  ) add

    template(v-slot:footer)
      div.deployment-target-new-networks-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onAddClick"
              :disabled="!isValid"
            ) {{ $t('general.add') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
  components: {
    BaseSelect,
    BaseModal,
    BaseTextInput,
    BaseButton
  },
  props: {
    organizationChoices: { // List of Meraki organizations
      type: Array,
      required: true
    }
  },

  data () {
    return {
      show: false,
      resolve: null,
      reject: null,
      selectedOrganization: null,
      networkNames: ['']
    }
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },

  computed: {
    isValid () {
      return !!this.selectedOrganization && this.networkNames.length > 0 && this.networkNames.filter(name => !name).length === 0
    },
    organizationOptions () {
      return this.organizationChoices.map(organization => {
        return {
          key: organization.id,
          name: organization.name
        }
      })
    },
    selectedOrganizationItem () {
      return this.organizationChoices.find(organization => organization.id === this.selectedOrganization)
    }
  },

  methods: {
    open () {
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onNetworkNameInput (value, index) {
      this.$set(this.networkNames, index, value)
    },
    onAddClick () {
      if (!this.isValid) {
        return
      }

      this.resolve(this.networkNames.map(networkName => {
        return {
          name: networkName,
          network_name: networkName,
          organization: this.selectedOrganizationItem.id,
          organization_name: this.selectedOrganizationItem.name
        }
      }))

      this.show = false
    },
    close () {
      this.show = false
    },
    resetForm () {
      this.selectedOrganization = (this.organizationChoices && this.organizationChoices.length === 1)
        ? this.organizationChoices[0].id : null
      this.networkNames = ['']
    },
    onAddNetworkClick () {
      this.networkNames = [...this.networkNames, '']
    },
    onRemoveNetworkClick (index) {
      this.networkNames = this.networkNames.filter((item, itemIndex) => itemIndex !== index)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .deployment-target-new-networks-modal {
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

      &__organization-row {
        margin-bottom: 10px;

        &__actions {
          &__action {
            cursor: pointer;
            line-height: 40px;
            margin-left: 10px;
            font-size: 24px;
          }
        }
      }
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }
  }

</style>
