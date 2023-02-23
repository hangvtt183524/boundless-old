<template lang="pug">
    // new group modal
    base-dialog(:show="show", max-width='700px', @close="close")
      v-layout(row)
        v-flex(xs10)
          h2.mb-3.dialog-heading {{ $t('settings.groupInfo') }}
      v-layout(row)
        v-flex(xs12)
          h4.pb-4
            | {{ $t('settings.newGroupDescription') }}
      v-layout(row)
        v-flex.px-3(xs12 sm6)
          node-name-input(
            :name="$t('settings.groupName')"
            v-model='groupName'
            :label="$t('settings.groupName') + ' *'"
            required
          )
        v-flex.px-3(xs12 sm6)
          node-select(
            :indent-level="0"
            :items="availableGroups"
            :label="$t('settings.selectGroup')"
            v-model="parentGroup"
            required
          )

      v-layout(row)
        v-flex(xs12 sm6)
        v-flex(xs12 sm6)
          p.py-5.pr-3.grey--text.lighten-4.text-sm-right
            v-btn(:loading='loading', :disabled='loading || disableSubmit', color='success', large, round, @click.native="saveNewGroup")
              | {{ $t('settings.saveGroup') }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'

import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

import NodeSelect from '@/components/common/node-select'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'NewGroupModal',

  props: ['show'],

  mixins: [
    ManageableNodesMixin
  ],

  components: {
    NodeSelect
  },

  data () {
    return {
      groupName: '',
      parentGroup: null,
      loading: false
    }
  },

  validations: {
    groupName: {
      required,
      maxLength: maxLength(64)
    }
  },

  watch: {
    selectedItems (newValue, oldValue) {
      this.parentGroup = newValue[0].id
    }
  },
  methods: {
    ...mapActions('organization/venue', ['addGroup']),
    close () {
      this.$emit('close')
      this.groupName = ''
      this.parentGroup = this.orgId
    },
    saveNewGroup () {
      this.loading = true

      this.addGroup({
        name: this.groupName,
        parent: this.parentGroup
      }).then(() => {
        this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        this.close(true)
        this.loading = false
        this.parentGroup = this.orgId
      }).catch(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.VENUE_GROUP_CREATED)
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    ...mapGetters('organization/venue', ['selectedItems']),
    disableSubmit () {
      return !this.groupName || this.$v.groupName.$invalid || !this.parentGroup
    },
    availableGroups () {
      return this.getNodesByType(['organization', 'group'])
    }
  }
}
</script>
<style lang="scss">
  .select-group-help {
    left: 100px; top: 0px;
  }

</style>
