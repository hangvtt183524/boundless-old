<template lang="pug">
  .organization-create-page
    .organization-create-page__header
      .organization-create-page__header__back-link-container
        v-icon.organization-create-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      .organization-create-page__header__tab-headers
        v-layout(row wrap)
          v-flex(xs3 md3 lg2 xl1)
            base-tab-header(
              :class="['tab-header--blue tab-header--underlined', 'tab-header--active']"
            ) {{ $t('organization.createManual') }}

    v-layout.organization-create-page__content(row wrap)
      v-flex(xs12)
        base-text-input.base-text-input--multiline(
          v-model="organizationData.name"
          :validations="nameValidations"
          :label="$t('organization.enterOrganizationName')"
        )
      v-flex(xs12)
        base-select(
          v-model="organizationData.region"
          :items="regionChoices"
          :validations="{required: true}"
          :label="$t('organization.selectRegion')"
        )
      v-flex(xs12)
        base-button.base-button--green(
          @click="onCreateClick"
          :disabled="!isValid"
        ) {{ $t('v2.organization.createOrganization') }}

    .organization-create-page__loading-indicator(v-if="loading")
      v-progress-circular(
        :size="50"
        indeterminate color="#15ac2f")

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import { maxLength } from '@/utils/form-fields-validation-rules'

export default {
  name: 'organization-create-page',
  components: {
    BaseTabHeader,
    BaseTextInput,
    BaseSelect,
    BaseButton
  },
  mixins: [
    NodeSelectionsMixin
  ],
  data: function () {
    return {
      loading: false,
      organizationData: {
        name: '',
        region: 'europe'
      },
      nameValidations: {
        required: true,
        methods: [{
          method: maxLength,
          parameters: [36]
        }]
      },
      products: ['captive_portal']
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    regionChoices () {
      return [
        'europe',
        'north_america',
        'south_america',
        'asia',
        'africa',
        'china'
      ].map(region => {
        return {
          key: region,
          name: this.$t(`regions.${region}`)
        }
      })
    },
    isValid () {
      return !!this.organizationData.name && !!this.organizationData.region
    }
  },
  methods: {
    ...mapActions('organization', ['createOrganization', 'fetchOrganizations']),
    ...mapActions('user', ['fetchUserRoles']),
    onCreateClick () {
      this.loading = true
      this.organizationData.name = this.organizationData.name.trim()
      this.organizationData.parent_workspace = this.workspaceId
      this.organizationData.products = this.products

      this.createOrganization(this.organizationData).then(response => {
        const organization = response.data.data

        // Select and redirect to the newly created organization
        this.fetchUserWorkspaceOrganizations({
          workspaceId: this.workspaceId
        }).then(() => {
          // Select organization and its root node
          this.selectOrganization(organization)
          this.selectNode({ id: organization.id })

          // Redirect to device listing page
          this.$router.push({
            name: 'OrganizationInventory',
            params: { ...this.$route.params, orgId: organization.id, nodeId: organization.id }
          })

          global.toastr['success'](this.$t('v2.organization.createOrganizationSuccess'), this.$t('general.success'))
        }).finally(() => {
          this.loading = false
        })

        // Re-fetch user roles to include permissions on newly created organization
        this.fetchUserRoles(this.currentUser.id)
      }).catch(() => {
        global.toastr['error'](this.$t('v2.organization.createOrganizationFailure'), this.$t('general.error'))
        this.loading = false
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/v2/colors";

.organization-create-page {
  background-color: $white;
  position: relative;
  width: 100%;

  &__header {
    height: 59px;
    padding: 0 60px 0 0;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    user-select: none;

    &__back-link-container {
      float: left;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border-right: 1px solid $gray-xlight;
      text-align: center;

      &__back-icon {
        color: $blue-reserve;
        line-height: 60px;
      }
    }

    &__tab-headers {
      width: calc(100% - 60px);
    }
  }

  &__content {
    max-width: 480px;
    padding: 24px 0;
  }

  &__title {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 25px;
    color: $blue-dark;
  }

  .base-button {
    margin-top: 20px;
    padding: 0 20px;
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
