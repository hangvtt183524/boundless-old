<template lang='pug'>
  v-layout.mb-3(row wrap)
    v-flex.pa-2.pt-3(xs12 md6)
      personal-info

    v-flex.pa-2.pt-3(xs12 md6)
      preferences

    v-flex.pa-2.pt-3(xs12 md6)
      email-info

    v-flex.pa-2.pt-3(xs12 md6)
      password-info

    v-flex.pa-2.pt-3(xs12 md6)
      boundless-api-info

    v-flex.pa-2.pt-3(xs12 md6)
      tfa-info

    v-flex.pa-2.pt-4(
      xs12
    )
      h3.small-heading.pb-3 {{ $t('general.accountAuthorization') }}
      permissions-table(
        :user-id="currentUser.id"
      )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import BoundlessApiInfo from './boundless-api-info'
import EmailInfo from './email-info'
import PasswordInfo from './password-info'
import PersonalInfo from './personal-info'
import Preferences from './preferences'
import TfaInfo from './tfa-info'
import PermissionsTable from './permissions-table'

export default {
  name: 'UserProfile',

  // use auth from auth.service
  props: ['auth'],

  mixins: [
    UserPermissionsMixin
  ],

  components: {
    EmailInfo,
    BoundlessApiInfo,
    PasswordInfo,
    PersonalInfo,
    Preferences,
    TfaInfo,
    PermissionsTable
  },

  data () {
    // each field is represented by a value property and its validation rule
    return {
      headers: [
        { text: 'Organization', align: 'left', value: 'name' },
        { text: 'Site/ Group', align: 'right', value: 'site' },
        { text: 'Admin', align: 'right', value: 'admin' },
        { text: 'Manage', align: 'right', value: 'manage' },
        { text: 'Edit', align: 'right', value: 'edit' },
        { text: 'Read', align: 'right', value: 'read' }
      ],
      desserts: [
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: false
        },
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: true
        },
        {
          value: false,
          name: 'Etam France',
          site: 'Rue de Rennes',
          admin: true,
          manage: false,
          edit: false,
          read: false
        }
      ]
    }
  },

  computed: {
    ...mapGetters('user', ['currentUser', 'userOptions'])
  },

  methods: {
    ...mapActions('user', ['fetchUserOptions'])
  }
}
</script>
