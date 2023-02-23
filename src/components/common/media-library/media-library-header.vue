<template lang="pug">
  .media-library-header
    base-tab-header(
      v-if="hasPermission('media_library__view', selectedOrganization.id)"
      :class="['tab-header--files', 'tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.myFiles}]"
      @click="$emit('tabChange', tabs.myFiles)"
    )
      | {{ $t('media.myFiles') }} ({{ filesCount }})
    base-tab-header(
      v-if="hasPermission('media_library__create', selectedOrganization.id)"
      :class="['tab-header--upload', 'tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.uploadFiles}]"
      @click="$emit('tabChange', tabs.uploadFiles)"
    )
      | {{ $t('media.uploadFiles') }}
    base-tab-header(
      v-if="hasPermission('media_library__create', selectedOrganization.id)"
      :class="['tab-header--upload-from-url', 'tab-header--underlined', 'tab-header--blue', {'tab-header--active': selectedTab === tabs.addFromURL}]"
      @click="$emit('tabChange', tabs.addFromURL)"
    )
      | {{ $t('media.addFromURL') }}
    .media-library-header__view-modes(
      v-if="selectedTab === tabs.myFiles"
    )
      v-btn(icon, @click="$emit('layoutChange', 'row')", data-test="btn-show-list" :class="{'active': currentLayout === 'row'}")
        v-icon fas fa-th-list
      v-btn(icon, @click="$emit('layoutChange', 'grid')", data-test="btn-show-grid" :class="{'active': currentLayout === 'grid'}")
        v-icon fas fa-th-large
</template>

<script>
import BaseTabHeader from '../../v2/base-tab-header/base-tab-header'
import { mapGetters } from 'vuex'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

export default {
  name: 'MediaLibraryHeader',
  mixins: [
    UserPermissionsMixin
  ],
  props: {
    selectedTab: {
      type: String,
      default: 'myFiles'
    },
    currentLayout: {
      type: String,
      default: 'grid'
    },
    filesCount: {
      type: Number
    }
  },
  components: {
    BaseTabHeader
  },
  data () {
    return {
      tabs: {
        myFiles: 'myFiles',
        uploadFiles: 'uploadFiles',
        addFromURL: 'addFromURL'
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/v2/colors.scss";

.media-library-header {
  background-color: $white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  height: 60px;
  display: flex;
  position: absolute;
  width: 100%;
  z-index: 1;

  &__view-modes {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 0 0 auto;

    .active.v-btn {
      background: $gray-medium;
      border-radius: 0;
    }

    .v-btn .v-icon {
      color: #9ba9c4;
      font-size: 18px;
    }

    .active.v-btn .v-icon {
      color: $blue-medium;
    }
  }

  @media only screen and (max-width: 767px) {
    padding: 0 5px;
  }

  .tab-header--blue {
    border-color: $blue-medium;
  }

  .tab-header--underlined.tab-header--blue.tab-header--active {
    color: $blue-medium;
  }

  .tab-header {
    min-width: auto;
    padding: 0 20px;

    @media only screen and (max-width: 1264px) {
      padding: 0 10px;
    }

    @media only screen and (max-width: 1024px) {
      padding: 0 5px;
    }

    @media only screen and (max-width: 767px) {
      font-size: 15px;
    }
  }

  .tab-header--files { // my files
    width: 169px;
  }
  .tab-header--upload { // upload files
    width: 138px;
  }
  .tab-header--upload-from-url { // add from url
    width: 147px;
  }

  .tab-header:not(:last-child) {
    margin-right: 22px;

    @media only screen and (max-width: 1264px) {
      margin-right: 22px;
    }

    @media only screen and (max-width: 1024px) {
      margin-right: 10px;
    }

    @media only screen and (max-width: 767px) {
      margin-right: 5px;
    }
  }
}
</style>
