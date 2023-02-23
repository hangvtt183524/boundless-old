<template lang="pug">
  .activity-log-page.page-content
    .activity-log-page__header
      h4.activity-log-page__header__page-title
        | {{ $t('organization.activityLog') }}

      .activity-log-page__header__filters
        base-select.base-select--small(
          v-model='workspaceAncestor'
          :items="workspaceAncestorOptions"
        )

      .activity-log-page__header__actions
        search-input.base-text-input--small(
          :placeholder="$t('general.search')"
          v-model="search"
        )

    .activity-log-page__content
      activity-log(
        :search="search"
        :ancestor-id="workspaceAncestor"
        :workspace-id="workspaceId"
      )

</template>

<script>
import ActivityLog from './activity-log'
import SearchInput from '@/components/v2/search-input/search-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'activity-log-page',
  components: {
    SearchInput,
    ActivityLog,
    BaseSelect
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      search: '',
      workspaceAncestor: -1
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceAncestorOptions () {
      return [
        {
          key: -1,
          name: this.$t('v2.workspaces.activityLog.allWorkspaceActions')
        },
        {
          key: this.workspaceId,
          name: this.$t('v2.workspaces.activityLog.onlyWorkspaceActions')
        }
      ].concat(this.userWorkspaceOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .activity-log-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px 0 0;
      overflow: hidden;

      &__page-title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__filters {
        float: left;
        margin-left: 20px;

        .base-select {
          margin-top: 15px;
          min-width: 200px;
        }
      }

      &__actions {
        float: right;

        .base-text-input {
          margin-top: 15px;
        }
      }
    }

    &__content {
      padding: 44px 40px;
      box-sizing: border-box;
      height: calc(100vh - 180px);

      .activity-log {
        height: 100%;
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
      background-color: rgba($white, 0.6);
    }
  }
</style>
