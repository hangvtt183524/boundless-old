<template lang="pug">
  .mist
    .mist__content
      v-layout(row wrap)
        v-flex(xs12 lg8 xl6)
          base-table(
            :items="secretKeys"
            :headers="tableHeaders"
            :actions="tableActions"
            @actionClick="onTableActionClick"
            @itemInput="onTableItemInput"
            :always-editable="true"
          )

      span.mist__content__add-chart-item-trigger(
        @click="onAddKeyClick"
      ) + {{ $t('general.addNew') }}

      .mist__content__actions
        base-button.base-button--green(
          @click="onSaveClick"
          :disabled="!(isChanged && isValid)"
        ) {{ $t('general.saveChanges') }}

        base-button.base-button--blue--negative(
          @click="onResetClick"
          :disabled="!isChanged"
        ) {{ $t('builder.reset') }}

    .mist__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTable from '@/components/v2/base-table/base-table'

export default {
  name: 'mist',
  components: {
    BaseTable,
    BaseButton
  },
  data: function () {
    return {
      loading: false,
      secretKeys: [],
      tableHeaders: [
        {
          text: this.$t('v2.organization.settings.wlanId'),
          value: 'wlan_id',
          editable: true
        },
        {
          text: this.$t('v2.organization.settings.portalSecretKey'),
          value: 'portal_secret_key',
          editable: true,
          protected: true,
          sortable: false
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ]
    }
  },
  mounted () {
    if (this.selectedOrganization.mist_portal_secret_keys) {
      this.setOrganizationSecretKeys()
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isChanged () {
      const organizationValues = this.selectedOrganization.mist_portal_secret_keys
        ? this.selectedOrganization.mist_portal_secret_keys.map(keyData => {
          return {
            wlan_id: keyData.wlan_id,
            portal_secret_key: keyData.portal_secret_key_display
          }
        })
        : []

      const formValues = this.secretKeys.map(keyData => {
        return {
          wlan_id: keyData.wlan_id,
          portal_secret_key: keyData.portal_secret_key
        }
      })

      return !_.isEqual(organizationValues, formValues)
    },
    isValid () {
      return this.secretKeys.filter(item => !item.wlan_id || (item.hasOwnProperty('portal_secret_key') && !item.portal_secret_key)).length === 0
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        if (this.selectedOrganization.mist_portal_secret_keys) {
          this.setOrganizationSecretKeys()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    setOrganizationSecretKeys () {
      this.secretKeys = JSON.parse(JSON.stringify(this.selectedOrganization.mist_portal_secret_keys)).map(keyData => {
        return {
          ...keyData,
          portal_secret_key: keyData.portal_secret_key_display
        }
      })
    },
    onAddKeyClick () {
      this.secretKeys.push({
        'wlan_id': '',
        'portal_secret_key': ''
      })
    },
    onTableActionClick (actionType, item) {
      if (actionType === 'remove') {
        this.secretKeys = this.secretKeys.filter(key => key !== item)
      }
    },
    onTableItemInput (tableItem, field, value) {
      this.$set(tableItem, field, value)
    },
    onResetClick () {
      this.setOrganizationSecretKeys()
    },
    onSaveClick () {
      const keys = _.cloneDeep(this.secretKeys)
      keys.forEach(keyData => {
        if (keyData.portal_secret_key === keyData.portal_secret_key_display) {
          // If value not changed, delete portal_secret_key so it will not be updated
          delete keyData.portal_secret_key
        }
      })

      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        mist_portal_secret_keys: keys
      }).then(res => {
        global.toastr['success'](this.$t('v2.organization.settings.mistSettingsUpdated'), this.$t('general.success'))
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .mist {
    width: 100%;
    padding: 25px;
    overflow: hidden;
    position: relative;

    &__content {
      &__add-chart-item-trigger {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 35px;
        text-decoration-line: underline;
        color: $green-medium;
        cursor: pointer;
      }

      .base-button {
        margin-top: 34px;
        margin-right: 20px;
        padding: 0 20px;
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
