<template lang="pug">
  .base-autocomplete(
    v-click-outside="onClickOutside",
  )
    base-text-input(
      v-model="search"
      :placeholder="placeholder"
      :label="label"
      :disabled="disabled"
      @focus="onFocus"
      @input="onSearchInput"
    )
    transition( name="slide")
      .base-autocomplete__listing(
        v-if="showOptions"
      )
        .base-autocomplete__listing__item(
          v-for="option in options"
          :key="option.id"
          @click="onClickOption(option)"
        ) {{ option.name }}
          span(v-if="showOrganizationName && option.organization_name")
            | {{ ` / ${option.organization_name}` }}
        .base-autocomplete__listing__item(
          v-if="(!options || !options.length)"
          @click="onClickONoResultOption()"
        ) {{ !loading? $t('v2.merakiClients.noResult') : $t('v2.merakiClients.loading') }}
        .base-autocomplete__listing__loading-indicator(v-if="loading")
          v-progress-circular(
            :size="25"
            indeterminate
            color="#15ac2f"
          )
</template>

<script>
import { mapActions } from 'vuex'
import _ from 'lodash'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'base-autocomplete',
  components: {
    BaseTextInput
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autocompleteKey: {
      type: String
    },
    externalMethod: {
      required: false
    },
    fixedOptions: {
      required: false
    },
    minimumQueryLength: {
      type: Number,
      default: 2
    },
    showOrganizationName: {
      type: Boolean,
      default: false
    },
    uniqueByName: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      search: '',
      loading: false,
      options: [],
      showOptions: false
    }
  },
  mounted () {
    this.search = this.value
  },
  methods: {
    ...mapActions('workspace/network', ['getMerakiEntities']),
    onSearchInput: _.debounce(function (item) {
      this.onInputKey(item)
    }, 400),
    onInputKey (item) {
      this.makeSearch(this.search)

      if (!this.autocompleteKey) {
        this.$emit('input', this.search)
      }
    },
    makeSearch (value) {
      if (value.length < this.minimumQueryLength) {
        return
      }

      this.showOptions = true
      const payload = {
        query: value
      }

      if (this.externalMethod) {
        this.loading = true
        this.externalMethod(payload).then(response => {
          this.options = response.data.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else if (this.autocompleteKey) {
        this.loading = true
        this.getMerakiEntities({ workspaceId: this.workspaceId, entityType: this.autocompleteKey, ...payload }).then(response => {
          if (this.uniqueByName) {
            this.options = _.uniqBy(response.data.data.results, 'name')
          } else {
            this.options = response.data.data.results
          }

          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else if (this.fixedOptions) {
        this.options = this.fixedOptions.filter(option => {
          return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
      }
    },
    onClickOption (item) {
      if (this.loading) {
        return
      }
      this.search = item.name
      this.showOptions = false
      this.$emit('input', this.search)
      this.$emit('optionSelect', item)
    },
    onClickOutside () {
      this.showOptions = false
    },
    onClickONoResultOption () {
      if (!this.loading) {
        this.showOptions = false
      }
    },
    onFocus () {
      this.$emit('focus')
      if (this.search.length < this.minimumQueryLength) {
        return
      }
      this.showOptions = true
    }
  }
}
</script>

<style src="./base-autocomplete.scss" lang="scss" scoped></style>
