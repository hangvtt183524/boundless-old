<template lang="pug">
  .media-library
    .media-header(data-test="media-header")
      .media-header-actions.left
        .filter-selector-container(
          v-if="showSearchInput"
        )
          search-input.base-text-input--small.media-search-text(
            v-model="search"
            :placeholder="$t('general.search')"
            @input="(val) => onChangeFilters({ search: val })"
          )
        .separator(
          v-if="showSearchInput"
        )
        base-check-box.base-check-box--small(
          v-if="multiSelect && !hideAction"
          :value="isSelectedAllItems"
          @click="onSelectAllCheckBoxClick"
          :label="$t('general.selectAll')"
        )
        .separator(
          v-if="multiSelect && !hideAction"
        )
        .filter-selector-container(
          v-if="mediaType === 'all'"
        )
          span.d-inline-block {{ $t('general.show') }}:
          base-n-switch.filter-selector(
            data-test="header-filter"
            :items="filterItems"
            v-model="filterBy"
            @input="(val) => onChangeFilters({ filterBy: val })"
          )
        .separator(
          v-if="mediaType === 'all'"
        )

        .header-sort-container
          span.d-inline-block {{ $t('media.sort') }}:
          base-select.header-sort(
            data-test="header-sort"
            :items="sortItems"
            v-model="sortBy"
            @input="(val) => onChangeFilters({ sortBy: val })"
          )
      .media-header-actions.right
        v-icon.media-header-actions__delete(
          v-if="hasPermission('media_library__delete', selectedOrganization.id)"
          v-show="!hideAction && multiSelect"
          data-test="btn-delete-files"
          small
          @click="showDeleteMediaDialog"
          :class="[{'media-header-actions__delete--disabled': !selectedFiles.length}]"
        ) $vuetify.icons.delete
    v-layout(row media-body)
      .dropzone-files(v-show="currentLayout === 'grid'")
        media-grid-view(
          :multi-select="multiSelect"
          :selected-files="selectedFiles"
          :hide-action="hideAction"
          :detail-asset="detailAsset"
          @loadMore="onLoadMoreFiles"
          @selectFile="selectFile"
          @setDetailAsset="setDetailAsset"
        )
      base-table(
        v-if="currentLayout !== 'grid'"
        :items="files"
        :headers="listViewHeaders"
        :sortable="false"
        :selected-row="detailAsset"
        selectable
        @rowSelect="onTableRowClick"
        @itemInput="onTableCellInput"
        @loadMore="onLoadMoreFiles"
      )
      .media-body__loading-indicator(v-if="loading")
        v-progress-circular(:size="50" indeterminate color="primary")
    delete-media-dialog(
      v-if="showDeleteConfirm"
      :show="showDeleteConfirm"
      @remove="deleteMediaLibrary"
      @close="showDeleteConfirm = false"
    )

</template>

<script>
import { mapGetters } from 'vuex'
import deleteMediaDialog from '@/components/common/media-library/delete-media-dialog'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseNSwitch from '@/components/v2/base-n-switch/base-n-switch'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input'
import ListSelectCell from '@/components/meraki/tags/column-components/list-select-cell'
import TableMediaCell from './table-media-cell'
import MediaGridView from './media-grid-view'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    deleteMediaDialog,
    BaseCheckBox,
    BaseNSwitch,
    BaseSelect,
    BaseTable,
    MediaGridView,
    SearchInput
  },
  mixins: [
    UserPermissionsMixin
  ],
  props: {
    multiSelect: {
      type: Boolean,
      default: true
    },
    showSearchInput: {
      type: Boolean,
      default: false
    },
    selectedFiles: {
      type: Array,
      default: () => []
    },
    mediaType: {
      type: String,
      default: 'all'
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideAction: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    isSelectedAllItems: {
      type: Boolean,
      default: false
    },
    currentLayout: {
      type: String,
      default: 'grid'
    },
    detailAsset: {
      type: Object
    }
  },
  data () {
    return {
      filterItems: [
        { text: this.$t('media.all'), value: '' },
        { text: this.$t('media.video'), value: 'video' },
        { text: this.$t('media.image'), value: 'image' }
      ],
      filterBy: '',
      sortItems: [
        { name: this.$t('media.name'), key: 'name' },
        { name: this.$t('media.uploadedBy'), key: 'updated_by_name' },
        { name: this.$t('media.sizeSmallToLarge'), key: 'size' },
        { name: this.$t('media.uploadedDate'), key: '-updated_at' }
      ],
      sortBy: '-updated_at',
      showDeleteConfirm: false,
      page: 1,
      search: ''
    }
  },
  mounted () {
    this.$emit('fetchData', {
      page: this.page,
      sortBy: this.sortBy,
      pageSize: this.pageSize,
      filterBy: this.filterBy
    })
  },
  computed: {
    ...mapGetters('organization/media', ['files', 'filesCount']),
    ...mapGetters('layout', ['selectedOrganization']),
    pageLength () {
      return Math.ceil(this.filesCount / this.pageSize)
    },
    listViewHeaders () {
      let basicListViewHeader = [
        {
          text: '',
          value: 'url',
          cellComponent: TableMediaCell,
          sortable: false,
          selectable: false
        },
        { text: this.$t('media.name'), sortable: true, value: 'name' },
        { text: this.$t('media.size'), sortable: true, value: 'size', formatter: this.getFileSize },
        { text: this.$t('media.type'), sortable: true, value: 'asset_type' },
        { text: this.$t('media.dimensionsInPX'), sortable: true, value: 'width', formatter: (width, item) => item.asset_type === 'image' ? `${Math.round(item.width)}x${Math.round(item.height)}` : '' },
        { text: this.$t('media.uploadedOn'), sortable: false, value: 'updated_at', formatter: (date) => this.$moment(date).format('L') },
        { text: this.$t('media.addedBy'), sortable: false, value: 'updated_by_name' }
      ]
      if (this.multiSelect) {
        basicListViewHeader.push({
          text: this.$t('general.select'),
          value: 'selected',
          cellComponent: ListSelectCell,
          sortable: false,
          selectable: false
        })
      }
      return basicListViewHeader
    }
  },
  methods: {
    onChangeFilters (value) {
      const keys = Object.keys(value)
      if (keys.indexOf('page') === -1) { // if page is not updated then set page to 1
        this.page = 1
      }
      keys.map(key => {
        this[key] = value[key]
      })
      this.$emit('fetchData', {
        page: this.page,
        sortBy: this.sortBy,
        pageSize: this.pageSize,
        filterBy: this.filterBy,
        search: this.search
      })

      if (value.sortBy) {
        EventTracker.sendEvent(EVENT_NAMES.MEDIA_LIBRARY_SORTED)
      }
    },
    onTableCellInput (item, field, value) {
      if (field === 'selected') {
        this.selectFile({}, item)
      }
    },
    onLoadMoreFiles () {
      if (this.files.length < this.filesCount && !this.loading) {
        this.onChangeFilters({
          page: this.page + 1
        })
      }
    },
    selectFile (e, file) {
      let found = this.selectedFiles.findIndex((f) => f.id === file.id)
      let selectFiles = Object.assign([], this.selectedFiles)
      if (found > -1) {
        selectFiles.splice(found, 1)
      } else {
        if (this.multiSelect) {
          selectFiles.push(file)
        } else {
          selectFiles = [file]
        }
      }
      this.$emit('select', selectFiles)
      this.$emit('onSelectAll', false)
    },
    onTableRowClick (item) {
      this.setDetailAsset(item)
    },
    setDetailAsset (file) {
      this.$emit('setDetailAsset', file)
    },
    deselectAll () {
      this.$emit('select', [])
      this.$emit('onSelectAll', false)
    },
    onSelectAll () {
      this.$emit('onSelectAll', true)
      this.$emit('select', this.files)
    },
    onSelectAllCheckBoxClick () {
      if (this.isSelectedAllItems) {
        this.deselectAll()
      } else {
        this.onSelectAll()
      }
    },
    getFileSize (bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    },
    showDeleteMediaDialog () {
      if (this.selectedFiles.length > 0) {
        this.showDeleteConfirm = true
      }

      EventTracker.sendEvent(EVENT_NAMES.MEDIA_ASSET_DELETED)
    },
    deleteMediaLibrary () {
      this.$emit('delete')
      this.showDeleteConfirm = false
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";
@import "../../../styles/v2/colors.scss";

.media-library {
  height: 100%;
  flex: 1;
  transition: all .5s;
  .media-header {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: $text-medium;
    display: flex;
    background-color: $white;
    border-bottom: solid 3px #EFF3F8;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 59px;

    .separator {
      display: inline-block;
      width: 1px;
      height: 28px;
      border-right: 1px solid $gray-medium;
    }
    .media-header-actions {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 768px;

      .media-search-text {
        width: 450px;
      }

      .base-check-box--small {
        .check-box-display {
          margin: 4px 0 4px 4px;
        }
        label {
          padding-left: 10px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          color: $text-medium;
        }
      }

      &__delete {
        color: $blue-dark;

        &--disabled {
          color: $gray-dark;
          cursor: not-allowed;
        }
      }

      .v-btn {
        .v-icon {
          color: #9ba9c4;
        }
      }

      .active.v-btn .v-icon {
        color: $primary;
      }

      .filter-selector-container {
        display: inline-block;
        .filter-selector {
          padding: 0px;
          height: 46px;
          width: 140px;
          margin-left: 14px;
          flex: none;
          width: 205px;
          line-height: 46px;
          padding: 3px 0 0 0;
        }
      }

      .header-sort-container {
        display: inline-block;
        .header-sort {
          padding: 0px;
          height: 46px;
          margin-left: 14px;
          flex: none;
          width: 187px;
          display: inline-block;

          .select-container:not(.select-container--active) {
            background: transparent;
            border-color: transparent;
          }
          .selected-item {
            line-height: 46px;
            i {
              line-height: 46px;
            }
          }
        }
      }
    }
    .media-header-actions.right {
      justify-content: flex-end;
      flex-wrap: wrap;
      flex: unset;
    }
  }

  .media-body {
    height: calc(100% - 60px);
    position: relative;

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

    .base-table {
      width: 100%;
      padding: 30px 31px;

      tr th:first-child {
        border-radius: 0;
      }
      tr th:last-child {
        border-radius: 0;
      }

      tr.selected {
        td.base-table-cell {
          border-top: 2px solid $primary;
          border-bottom: 2px solid $primary;
        }
        td.base-table-cell:first-child {
          border-left: 3px solid $primary;
        }
        td.base-table-cell:last-child {
          border-right: 2px solid $primary;
        }
      }
      tr.selected:first-child {
        td.base-table-cell {
          border-top: 3px solid $primary;
        }
      }
    }
  }

  .dropzone-files {
    flex: 1;
    padding: 30px 31px;
    height: 100%;
  }
}
</style>
