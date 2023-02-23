// Mixin providing suggestions-related functionality to flex template setting components
import { mapActions } from 'vuex'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    fieldSuggestions: {
      type: Object
    }
  },
  data: function () {
    return {
      suggestionFields: []
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTemplateFieldSuggestions']),
    getFieldSuggestions (setting, field) {
      return (this.fieldSuggestions && this.fieldSuggestions[setting] && this.fieldSuggestions[setting][field])
        ? this.fieldSuggestions[setting][field]
        : null
    },
    getSuggestionsForMultiTextInput (setting, field) {
      const suggestions = this.getFieldSuggestions(setting, field)
      return suggestions ? suggestions.map(item => { return { key: item, name: item } }) : null
    },
    fetchFieldSuggestions (setting, field, commaSeparated) {
      if (!(this.fieldSuggestions[setting] && this.fieldSuggestions[setting][field])) {
        // Suggestions not fetched, fetch now
        this.fetchMerakiTemplateFieldSuggestions({
          workspaceId: this.workspaceId,
          setting: setting,
          field: field,
          comma_separated: commaSeparated || false
        }).then(response => {
          this.$emit('fieldSuggestionInput', setting, field, response.data.data.results)
        })
      }
    },
    onTableItemFocus (tableItem, field, parent, setting) {
      // Replace nested field separators
      field = field.replace(/\./g, '__')

      // By default, use component's field_key
      setting = setting || this.field_key

      if (parent) {
        field = `${parent}__${field}`
      }

      if (!this.fieldSuggestions || this.suggestionFields.indexOf(field) === -1) {
        return
      }

      const commaSeparated = this.commaSeparatedFields && this.commaSeparatedFields.indexOf(field) > -1
      this.fetchFieldSuggestions(setting, field, commaSeparated)
    },
    onFieldSuggestionInput (setting, field, suggestions) {
      this.$emit('fieldSuggestionInput', setting, field, suggestions)
    }
  }
}
