<template lang="pug">
  v-layout(row wrap my-4)
    v-flex.pa-2.pt-3(
      v-for="(value, key, index) in authData"
      :key="key"
      xs12 md6
    )
      panel-container
        v-flex.label-wrapper(xs5 slot="title")
          v-icon(:class="`${key} fab fa-${key}`")
          span {{ key }}

        v-layout(row wrap)
          v-flex(
            v-for="field in value.fields"
            :key="field.key"
            xs12 md6 px-3
          )
            readonly-input(
              :label="$t(`general.${field.label}`)"
              :value="visitorDetails[field.key]"
              :multi-line="field.multiline"
              rows="1"
              auto-grow
            )
</template>
<script>
import { mapGetters } from 'vuex'

import CurrentUserMixin from '@/mixins/current-user.mixin'

import PanelContainer from '@/components/common/panel-container'

export default {
  mixins: [
    CurrentUserMixin
  ],
  components: {
    PanelContainer
  },
  data () {
    return {
      authData: {
        facebook: {
          fields: [
            { label: 'name', key: 'facebook_name' },
            { label: 'email', key: 'facebook_email' },
            { label: 'imageUrl', key: 'facebook_image_url' }
          ]
        },
        instagram: {
          fields: [
            { label: 'nickName', key: 'instagram_username' }
          ]
        },
        twitter: {
          fields: [
            { label: 'name', key: 'twitter_name' },
            { label: 'screenName', key: 'twitter_screen_name' },
            { label: 'profileUrl', key: 'twitter_profile_picture' },
            { label: 'followersCount', key: 'twitter_followers_count' },
            { label: 'friendsCount', key: 'twitter_friends_count' }
          ]
        },
        linkedin: {
          fields: [
            { label: 'name', key: 'linkedin_name' },
            { label: 'email', key: 'linkedin_email' },
            { label: 'nickName', key: 'linkedin_username' },
            { label: 'imageUrl', key: 'linkedin_image_url' },
            { label: 'profileUrl', key: 'linkedin_profile_url' },
            { label: 'industry', key: 'linkedin_industry' }
          ]
        },
        google: {
          fields: [
            { label: 'name', key: 'google_name' },
            { label: 'firstName', key: 'google_first_name' },
            { label: 'lastName', key: 'google_last_name' },
            { label: 'profileUrl', key: 'google_profile_picture' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters('organization/visitor', ['visitorDetails'])
  }
}
</script>

<style lang="scss" scoped>
.label-wrapper ::v-deep {
  display: flex;
  align-items: center;

  span {
    color: #43619c;
    margin-left: 15px;
    font-weight: 600;
    text-transform: uppercase;
  }
}
</style>
