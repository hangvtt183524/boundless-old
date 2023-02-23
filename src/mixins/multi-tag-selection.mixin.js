import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

let MultiTagSelectionMixin = {
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    selectedResources: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dialogExpanded: false,
      value: [],
      options: [],
      searchText: ''
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['merakiTags']),
    defaultTagOptions () {
      if (!(this.merakiTags && this.merakiTags.data && this.merakiTags.data.results)) {
        return []
      }

      return _.uniq(this.merakiTags.data.results.map(tag => tag.name)).slice(0, 12).map(tag => {
        return {
          name: tag
        }
      })
    },
    tagOptions () {
      // If we do not have a search text, and have no options, display default options
      return (!!this.searchText || this.options.length > 0)
        ? this.options
        : this.defaultTagOptions
    }
  },
  watch: {
    dialogExpanded: {
      handler: function () {
        if (!this.dialogExpanded) {
          // Reset value and options list on close
          this.value = []
          this.options = []
        }
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchTagSuggestions']),
    onClickOutside () {
      this.dialogExpanded = false
    },
    onOpenDialog () {
      if (this.selectedResources.length > 0) {
        this.dialogExpanded = true
      }
    },
    onSearchChange: _.debounce(function (searchText) {
      this.searchText = searchText

      if (!(searchText && searchText.length > 2)) {
        // Do not run empty query
        return
      }

      this.fetchTagSuggestions({
        workspaceId: this.workspaceId,
        query: searchText
      }).then(response => {
        this.$set(this, 'options', response.data.data)
      })
    }, 400),
    addTag (newTag) {
      const tags = newTag.split(/\s+/)
      tags.forEach(tag => {
        this.value.push({
          name: tag
        })
      })
    }
  }
}

export default MultiTagSelectionMixin
