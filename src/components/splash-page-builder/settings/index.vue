<template lang="pug">
  .settings-panel(@click="onPanelClick", v-if="page.config && show")
    h3.mb-4  {{$t('builder.settings')}}
    ul.setting-list
      li(@click.stop="selectSettingsView('general')", :class="{'active': isActive('general')}")
        span {{$t('builder.general')}}
        v-icon arrow_right_alt
        general(:page="page")
      li(@click.stop="selectSettingsView('translations')", :class="{'active': isActive('translations')}")
        span {{$t('builder.translations')}}
        v-icon arrow_right_alt
        translations-dialog(
          :show="selectedView === 'translations'"
          @close="selectedView = null"
          @save="selectedView = null"
          @preview="onPreview"
          :page="page"
          :selected-page="selectedPage"
          :previewLang="previewLang"
        )
      li(@click.stop="selectSettingsView('fonts')", :class="{'active': isActive('fonts')}")
        span {{$t('builder.fonts')}}
        v-icon arrow_right_alt
        fonts-panel(:page-config="page.config")
      li(@click.stop="selectSettingsView('reset')", :class="{'active': isActive('reset')}")
        span {{$t('builder.reset')}}
        v-icon arrow_right_alt
        .sub-panel
          label {{$t('builder.resetDetail')}} <br>
          v-btn(color="primary", round, @click="resetAll").ml-0 {{$t('builder.reset')}}
      li(@click.stop="selectSettingsView('defaultPage')", :class="{'active': isActive('defaultPage')}")
        span {{$t('builder.defaultPage')}}
        v-icon arrow_right_alt
        .sub-panel
          label {{$t('builder.selectDefaultPage')}} <br>
          v-radio-group(v-model="page.config.pages.defaultPage")
            v-radio(label="Guest Form", value="guestForm")
            v-radio(label="Guest Social", value="guestSocial")
            v-radio(label="SMS Registration", value="smsRegistration")
            v-radio(label="Sponsoring", value="sponsorPage")
            v-radio(label="Ticketing", value="ticketing")
            v-radio(label="Codes", value="codes")
            v-radio(label="SSO", value="sso")
            v-radio(label="User Login", value="userLogin")
            v-radio(label="Wifi4eu", value="wifi4eu")
          label(
            v-if="page.config.pages.defaultPage === 'wifi4eu'"
          ) {{$t('builder.enterWifi4euNetworkId')}} <br>
          input(
            v-if="page.config.pages.defaultPage === 'wifi4eu'"
            type="text"
            v-model="page.config.settings.wifi4euNetworkId"
            class="form-control mt-2"
            placeholder="123e4567-e89b-12d3-a456-426655440000"
          )
      li(@click.stop="selectSettingsView('poweredBy')", :class="{'active': isActive('poweredBy')}")
        span {{$t('builder.poweredBy')}}
        v-icon arrow_right_alt
        .sub-panel
          label {{$t('builder.poweredByDetail')}} <br>
          base-switch(
            :label-right="$t('builder.poweredByVisible')"
            v-model="page.config.settings.poweredBy.config.enabled"
            color="deep-purple lighten-2"
          )
          logo-selection(
            :selected-item="page.config.settings.poweredBy.config.logo"
            @logo-changed="onLogoChange"
          )
      li.selected-lang-container
        span.selected-lang-text {{previewLangInfo.language}}
        div(:class="previewLangInfo.vtelClass")
</template>

<script>
import logoSelection from '../option-types/logo'
import fontsPanel from './fonts'
import backgroundPanel from './backgrounds'
import general from './general'
import translationsDialog from './translations-dialog'
import languages from './translations/languages'

export default {
  props: ['page', 'selectedPage', 'previewLang', 'defaultLang', 'show', 'windowSize'],
  data () {
    return {
      selectedView: null,
      devices: ['desktop', 'tablet', 'mobile']
    }
  },
  components: {
    fontsPanel,
    backgroundPanel,
    general,
    translationsDialog,
    logoSelection
  },
  computed: {
    previewLangInfo () {
      const previewLangInfo = languages.find(langInfo => langInfo.localeCountry === this.previewLang)
      if (!previewLangInfo) {
        return languages.find(langInfo => langInfo.localeCountry === this.defaultLang)
      }
      return previewLangInfo
    }
  },
  methods: {
    onLogoChange (xx) {
      console.log('onLogoChange', xx)
    },
    onPreview (lang) {
      this.$emit('preview', lang)
    },
    selectSettingsView (view) {
      this.selectedView = view
    },
    isActive (view) {
      return this.selectedView === view
    },
    onPanelClick (view) {
      this.selectedView = null
    },
    resetAll () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";

  .page-builder {
    .settings-panel {
      position: relative;
    }

    .setting-list {
      width: calc(100% - 28px);
      padding: 0px;

      .form-control {
        height: 30px;
        background: white;
        width: 100%;
        padding: 5px 10px;
        outline: none;
      }
    }

    .upload-mode {
      label {
        margin-top: -3px;
      }
    }

    .choose-image {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }

    .setting-list li {
      display: block;
      font-size: 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding-bottom: 5px;
      cursor: pointer;
      margin-bottom: 10px;

      .v-icon {
        color: $primary !important;
        display: none;
      }

      &.active {
        color: $primary;

        .v-icon {
          display: block;
        }

        .sub-panel {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .sub-panel {
      position: absolute;
      min-width: 300px;
      left: calc(100% + 1px);
      background: hsla(213, 39%, 90%, 1);
      color: #0f202f;
      top: 1px;
      padding: 15px;
      opacity: 0;
      visibility: hidden;
      cursor: default;
      height: 100%;

      label {
        color: rgba(0,0,0,.54);
      }
    }

    .selected-lang-container {
      cursor: default !important;
      width: calc(100% + 28px) !important;
    }
  }
</style>
