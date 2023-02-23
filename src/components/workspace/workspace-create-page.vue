<template lang="pug">
  .workspace-create-page
    v-layout.workspace-create-page__content(row wrap)
      v-flex(xs12)
        base-text-input.base-text-input--multiline(
          v-model="workspaceData.name"
          :validations="nameValidations"
          :label="$t('v2.workspaces.enterWorkspaceName')"
        )
      v-flex(xs12)
        base-button.base-button--green(
          @click="onCreateClick"
          :disabled="!isValid"
        ) {{ $t('v2.workspaces.createWorkspace') }}

    .workspace-create-page__loading-indicator(v-if="loading")
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
  name: 'workspace-create-page',
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
      workspaceData: {
        name: ''
      },
      nameValidations: {
        required: true,
        methods: [{
          method: maxLength,
          parameters: [64],
          message: this.$t('v2.validations.maxLength').replace('{max_length}', 64)
        }]
      },
      maxNameLength: 64
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    isValid () {
      return !!this.workspaceData.name && this.workspaceData.name.length < this.maxNameLength
    }
  },
  methods: {
    ...mapActions('workspace', ['createWorkspace']),
    ...mapActions('user', ['fetchUserRoles']),
    onCreateClick () {
      this.loading = true
      this.workspaceData.name = this.workspaceData.name.trim()

      this.createWorkspace(this.workspaceData).then(response => {
        const workspace = response.data.data

        // Select and redirect to the newly created workspace
        this.fetchUserWorkspaces().then(() => {
          // Select workspace
          this.selectWorkspace(workspace)

          // Redirect to organization list page
          this.$router.push({
            name: 'OrganizationList',
            params: { ...this.$route.params, workspaceId: workspace.id }
          })

          global.toastr['success'](this.$t('v2.workspaces.createWorkspaceSuccess'), this.$t('general.success'))
        }).finally(() => {
          this.loading = false
        })

        // Re-fetch user roles to include permissions on newly created organization
        this.fetchUserRoles(this.currentUser.id)
      }).catch(() => {
        global.toastr['error'](this.$t('v2.workspaces.createWorkspaceFailure'), this.$t('general.error'))
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/v2/colors";

.workspace-create-page {
  background-color: rgba($blue-dark, .9);
  position: fixed;
  left: 0;
  top: 55px;
  width: 100%;
  height: 100%;
  z-index: 100;

  @media (max-width: 767px) {
    height: 95px;  // To match toolbar
  }

  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    max-width: 640px;
    padding: 80px;
    background-color: $white;
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
