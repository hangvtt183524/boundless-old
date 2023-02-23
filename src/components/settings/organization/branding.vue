<template lang="pug">
  .branding
    .branding__logo-section
      .branding__logo-section__logo-container(
        :class="{'branding__logo-section__logo-container--no-image': !logoData.logo_details.url, 'branding__logo-uploading': isUploadingLogo}"
        ref="dropzoneElement"
        id="dropzone"
      )
        img.branding__logo-section__logo-container__logo(
          v-if="logoData.logo_details.url"
          :src="logoData.logo_details.url"
        )
        .branding__logo-section__logo-container__drag-drop-helper(
          v-if="!logoData.logo_details.url"
        )
          | {{ $t('v2.organization.settings.dragDropImage') }}
      .branding__logo-section__constraint
        span.branding__logo-section__constraint__title
          | {{ $t('v2.organization.settings.maxSize') }}:
        |  2 MB
      .branding__logo-section__constraint
        span.branding__logo-section__constraint__title
          | {{ $t('v2.organization.settings.format') }}:
        |  .jpg .png
    .branding__content
      .branding__content__upload-section
        .branding__content__upload-section__title {{ $t('v2.organization.settings.logo') }}
        .branding__content__upload-section__description {{ $t('v2.organization.settings.uploadLogoDescription') }}
        .branding__content__upload-section__actions
          base-button.base-button--blue(
            v-if="hasPermission('media_library__create', selectedOrganization.id) || hasPermission('media_library__view', selectedOrganization.id)"
            @click="onUploadLogoClick"
          ) {{ $t('v2.organization.settings.uploadImage') }}
          base-button.base-button--blue--negative(
            v-if="selectedOrganization.logo !== null"
            @click="onRemoveLogoClick"
          ) {{ $t('v2.organization.settings.removeLogo') }}
      .branding__content__settings-section
        .branding__content__settings-section__title
          | {{ $t('v2.organization.settings.useLogoIn') }}
        .branding__content__settings-section__setting-item
          base-check-box(
            v-model="logoData.is_on_dashboard"
            :label="$t('v2.organization.settings.dashboardLogo')"
          )
        .branding__content__settings-section__setting-item
          base-check-box(
            v-model="logoData.is_on_splash_pages"
            :label="$t('v2.organization.settings.splashPages')"
          )
        .branding__content__settings-section__setting-item
          base-check-box(
            v-model="logoData.is_on_emails"
            :label="$t('v2.organization.settings.outgoingTransactionalEmails')"
          )
        base-button.base-button--green(
          @click="onSaveClick"
          :disabled="logoData.logo === null || !isChanged"
        ) {{ $t('general.saveChanges') }}

    .branding__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    media-library-dialog(
      v-if="showMediaLibrary"
      :show="showMediaLibrary"
      :media-type="'image'"
      :isShowConfirmMessage="false"
      @close="showMediaLibrary = false"
      @select="onMediaSelect"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropzone from 'dropzone'
import Ls from '@/services/ls'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import MediaLibraryDialog from '@/components/common/media-library/media-library-dialog'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

const API_URL = process.env.VUE_APP_API_URL

export default {
  name: 'branding',
  components: {
    BaseCheckBox,
    BaseButton,
    MediaLibraryDialog
  },
  mixins: [
    UserPermissionsMixin
  ],
  data: function () {
    return {
      loading: false,
      isUploadingLogo: false,
      showMediaLibrary: false,
      logoData: this.getEmptyLogoObject()
    }
  },
  mounted () {
    if (this.selectedOrganization.logo) {
      this.logoData = JSON.parse(JSON.stringify(this.selectedOrganization.logo))
    }

    // Initialize dropzone element
    const orgId = this.$route.params.orgId
    const vm = this
    let options = {
      url: `${API_URL}/organization/${orgId}/asset/`,
      method: 'post',
      acceptedFiles: '.png, .jpeg, .jpg',
      timeout: 100000,
      headers: {
        'Authorization': `Bearer ${Ls.get('auth.token')}`,
        'Accept': 'application/json',
        'Cache-Control': '',
        'X-Requested-With': ''
      },
      autoProcessQueue: true,
      accept (file, done) {
        vm.isUploadingLogo = true
        done()
      },
      sending (file, xhr, formData) {
        formData.append('name', file.name)
        formData.append('original_size', file.size)
        formData.append('content_type', file.type)
        formData.append('asset_type', 'image')
        formData.append('original_width', 0)
        formData.append('original_height', 0)
      },
      success (file, response) {
        vm.onMediaSelect(response.data)
        vm.isUploadingLogo = false
      },
      complete () {
        vm.$refs.dropzoneElement.style.pointerEvents = 'initial'
      }
    }
    this.dropzone = new Dropzone(this.$refs.dropzoneElement, options)
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isChanged () {
      const originalData = this.selectedOrganization.logo ? this.selectedOrganization.logo : this.getEmptyLogoObject()
      return originalData.logo !== this.logoData.logo || originalData.is_on_dashboard !== this.logoData.is_on_dashboard ||
        originalData.is_on_splash_pages !== this.logoData.is_on_splash_pages || originalData.is_on_emails !== this.logoData.is_on_emails
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        if (this.selectedOrganization.logo) {
          this.logoData = JSON.parse(JSON.stringify(this.selectedOrganization.logo))
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    getEmptyLogoObject () {
      return {
        logo: null,
        logo_details: {},
        is_on_dashboard: true,
        is_on_splash_pages: true,
        is_on_emails: true
      }
    },
    onUploadLogoClick () {
      this.showMediaLibrary = true
    },
    onRemoveLogoClick () {
      // Send logo as null to remove logo
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        logo: null
      }).then(res => {
        global.toastr['success'](this.$t('v2.organization.settings.logoRemoved'), this.$t('general.success'))
        this.logoData = this.getEmptyLogoObject()
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_LOGO_REMOVED)
    },
    onSaveClick () {
      this.saveLogoSettings()

      const originalData = this.selectedOrganization.logo ? this.selectedOrganization.logo : this.getEmptyLogoObject()
      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_LOGO_USAGE_CHANGED, {
        changed_fields: ['is_on_dashboard', 'is_on_splash_pages', 'is_on_emails'].filter(field => originalData[field] !== this.logoData[field])
      })
    },
    saveLogoSettings () {
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        logo: this.logoData
      }).then(res => {
        global.toastr['success'](this.$t('v2.organization.settings.logoSettingsUpdated'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })
    },
    onMediaSelect (asset) {
      this.$set(this.logoData, 'logo', asset.id)
      this.$set(this.logoData.logo_details, 'url', asset.url)
      this.showMediaLibrary = false

      // Automatically save image
      this.saveLogoSettings()

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_LOGO_UPLOADED)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .branding {
    width: 100%;
    padding: 25px;
    overflow: hidden;

    &__logo-section {
      width: 200px;
      text-align: center;
      margin-right: 72px;
      float: left;

      &__logo-container {
        width: 100%;
        padding: 30px 0;
        background-color: $gray-xlight;
        margin-bottom: 14px;
        box-sizing: border-box;

        &__logo {
          max-width: 125px;
        }

        &__drag-drop-helper {
          width: 100%;
          font-family: Source Sans Pro;
          font-style: normal;
          font-weight: bold;
          font-size: 16px;
          line-height: 20px;
          margin-top: 50px;
          padding: 0 40px;
          color: $gray-dark;
        }

        &--no-image {
          height: 200px;
          border: 2px dashed $gray-dark;
        }
      }

      &__constraint {
        margin: 5px 0;
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        color: $text-medium;

        &__title {
          font-weight: 600;
        }
      }
    }

    &__content {
      float: left;

      &__upload-section {
        padding: 45px 0 34px 0;
        border-bottom: 3px solid $gray-xlight;

        &__title {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 24px;
          color: $text-dark;
        }

        &__description {
          font-family: Source Sans Pro;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
          color: $text-medium;
          margin-top: 10px;
        }

        &__actions {
          margin-top: 18px;

          .base-button {
            min-width: 215px;

            @media (max-width: 767px) {
              min-width: 160px;
            }

            &:not(:first-child) {
              margin-left: 14px;
            }
          }
        }
      }

      &__settings-section {
        padding: 36px 0 52px 0;

        &__title {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 26px;
          color: $text-medium;
          margin-bottom: 15px;
        }

        &__setting-item {
          margin-bottom: 5px;
        }

        .base-button {
          margin-top: 34px;
          min-width: 215px;
        }
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

    ::v-deep {
      &.dz-started {
        .dz-message {
          display: none !important;
        }
      }

      .dz-image, .dz-success-mark, .dz-error-mark {
        display: none;
      }
      .dz-preview.dz-processing {
        span {
          display: none !important;
        }
      }
      .branding__logo-uploading {
        .dz-progress,
        .dz-progress:before {
          height: 10px;
        }
      }
      .dz-preview.dz-processing:last-child {
        margin-top: 5px;
        .dz-progress,
        .dz-progress:before {
          width: 80px;
          border-radius: 8px;
          margin: 0 auto;
          left: 0;
          right: 0;
          transition: none;
        }
        .dz-progress {
          background-color: #b3d4fc;
          display: -webkit-flex;
          display: flex;
        }

        .dz-progress:before {
          background-color: #3f51b5;
          content: '';
          -webkit-animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @-webkit-keyframes running-progress {
          0% { margin-left: 0px; margin-right: 100%; }
          50% { margin-left: 25%; margin-right: 0%; }
          100% { margin-left: 100%; margin-right: 0; }
        }
        @keyframes running-progress {
          0% { margin-left: 0px; margin-right: 100%; }
          50% { margin-left: 25%; margin-right: 0%; }
          100% { margin-left: 100%; margin-right: 0; }
        }
      }
    }
  }

</style>
