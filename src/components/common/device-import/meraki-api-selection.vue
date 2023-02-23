<template lang='pug'>
  v-flex(v-if="hasMerakiApi")
    p.pt-2(v-if="isInCorrectMerakiApi")
      | {{ $t('inventory.inCorrectMerakiApi') }}.
      | {{ $t('inventory.updateMerakiApi') }}&nbsp;
      router-link(:to="{ name: 'UserProfile' }")
        | {{ $t('general.profilePage') }}.
      <br>
      | {{ $t('inventory.merakiApiRecentlyUpdated') }}&nbsp;

    v-select(
      data-test="select-meraki"
      v-else
      @change="change"
      :items="merakiOrgs"
      :label="$t('general.selectMerakiOrg')"
      :value="value"
      item-text="name"
      item-value="id"
      required
    )
  v-flex(v-else)
    p.pt-2
      | {{ $t('inventory.noMerakiApi') }}.
      | {{ $t('inventory.saveMerakiApi') }}
      | {{ $t('inventory.editMerakiApi') }}&nbsp;
      router-link(:to="{ name: 'UserProfile' }")
        | {{ $t('general.profilePage') }}.

    v-layout(row wrap)
      v-flex
        v-text-field(
          data-test="meraki-api-input"
          :label="$t('general.apiKey')"
          v-model="merakiApi"
          clearable
        )
      v-flex(xs2)
        v-btn(
          data-test="btn-save-meraki"
          :disabled="!merakiApi"
          :loading="isSavingMerakiApi"
          @click="saveMerakiApi"
          color="success"
          round
          outline
        )
          | {{ $t('general.save') }}
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'

export default {
  props: {
    value: {
      type: [Number, String],
      default: null
    }
  },
  mixins: [
    CurrentUserMixin,
    ErrorHandlerMixin
  ],
  mounted () {
    if (this.hasMerakiApi) {
      this.fetchOrgs()
    }
  },
  data () {
    return {
      merakiApi: '',
      isSavingMerakiApi: false,
      isInCorrectMerakiApi: false
    }
  },
  computed: {
    ...mapGetters('organization/device', ['merakiOrgs']),
    ...mapGetters('layout', ['selectedOrganization']),
    hasMerakiApi () {
      return Boolean(this.profile.meraki_api_key_display)
    }
  },
  methods: {
    ...mapActions('organization/device', ['fetchMerakiOrgs']),
    saveMerakiApi () {
      this.isSavingMerakiApi = true
      const data = {
        profile: { meraki_api_key: this.merakiApi }
      }
      this.updateCurrentUser(data).then(() => {
        this.isSavingMerakiApi = false
      }).catch(err => {
        this.setErrorData(err)
        this.isInCorrectMerakiApi = true
      })
    },
    fetchOrgs () {
      this.fetchMerakiOrgs(this.selectedOrganization.id).then(response => {
      }).catch((error) => {
        this.setErrorData(error)
        this.isInCorrectMerakiApi = true
      })
    },
    change (selectedOrg) {
      this.$emit('input', selectedOrg)
    },
    submit (createSites) {
      const data = {
        orgId: this.selectedOrganization.id,
        meraki_organization_id: this.value,
        create_sites: createSites
      }
      return this.$store.dispatch('organization/device/merakiApiImport', data)
    }
  },
  watch: {
    hasMerakiApi (value) {
      if (value && this.selectedOrganization.id) {
        this.fetchOrgs()
      }
    }
  }
}
</script>
