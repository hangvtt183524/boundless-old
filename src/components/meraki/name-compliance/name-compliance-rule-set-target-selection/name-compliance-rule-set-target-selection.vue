<template lang="pug">
  .name-compliance-rule-set-target-selection
    .name-compliance-rule-set-target-selection__entity-type(
      v-for="entityType of entityTypeOptions"
      :key="entityType.key"
    )
      v-layout(row wrap)
        v-flex(xs6 md4 lg3)
          base-check-box(
            :value="selectedTypes.indexOf(entityType.key) > -1"
            :label="entityType.name"
            @input="onEntityTypeSelectionInput(entityType, $event)"
          )
        v-flex(
          v-show="selectedTypes.indexOf(entityType.key) > -1"
          xs6 md8 lg9
        )
          base-multi-select.base-multi-select--small(
            :value="getTagSelectionsForEntityType(entityType)"
            :items="tagOptions[entityType.key]"
            :label="getTagFilterLabel(entityType)"
            :search-enabled="true"
            :placeholder="$t('v2.nameCompliance.optionallyFilterByTags')"
            @input="onTagsInput(entityType, $event)"
            @searchInput="onTagsSearchInput(entityType, $event)"
          )

</template>

<script>
import { mapActions } from 'vuex'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'name-compliance-rule-set-target-selection',
  components: {
    BaseMultiSelect,
    BaseCheckBox
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      entityTypeOptions: ['network', 'device', 'ssid', 'switch_port', 'vlan'].map(entityType => {
        return {
          key: entityType,
          name: this.$t(`v2.nameCompliance.entityTypesPlural.${entityType}`)
        }
      }),
      searchTargetOptions: {},
      isActivated: false,
      emptyQueryTagOptions: []
    }
  },
  computed: {
    selectedTypes () {
      return this.value.map(entityType => entityType.type)
    },
    flatValue () {
      // Flat list of targets as type_id elements, to be used in multi text input component
      return this.value.map(target => {
        return `${target.target_type}__${target.id}`
      })
    },
    tagOptions () {
      const tagOptions = {
        network: this.searchTargetOptions.network || [],
        device: this.searchTargetOptions.device || [],
        ssid: this.searchTargetOptions.ssid || [],
        switch_port: this.searchTargetOptions.switch_port || [],
        vlan: this.searchTargetOptions.vlan || []
      }

      // Add option entries for already selected items, if not there
      this.value.forEach(entityType => {
        entityType.tags.forEach(entityTypeTag => {
          if (tagOptions[entityType.type].filter(option => option.key === entityTypeTag.tag).length === 0) {
            tagOptions[entityType.type].push({
              key: entityTypeTag.tag,
              name: `${entityTypeTag.organization_name} - ${entityTypeTag.name}`,
              original_name: entityTypeTag.name,
              organization_name: entityTypeTag.organization_name
            })
          }
        })
      })

      return tagOptions
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTargetSuggestions']),
    getTagSelectionsForEntityType (entityType) {
      return this.selectedTypes.indexOf(entityType.key) > -1
        ? this.value.find(item => item.type === entityType.key).tags.map(tagData => tagData.tag) : []
    },
    onEntityTypeSelectionInput (entityType, value) {
      if (value) {
        this.$emit('input', [
          ...this.value,
          {
            type: entityType.key,
            tags: []
          }
        ])

        // Fetch initial tag options if activated for the first time
        if (!this.isActivated) {
          this.fetchEmptyQueryTagOptions()
        }
        this.isActivated = true

        // Set empty tag options on activation
        this.onTagsSearchInput(entityType, '')
      } else {
        this.$emit('input', this.value.filter(item => item.type !== entityType.key))
      }
    },
    onTagsInput (entityType, tags) {
      this.$emit('input', this.value.map(item => {
        if (item.type !== entityType.key) {
          return item
        }

        return {
          ...item,
          tags: tags.map(tagId => {
            return {
              tag: tagId,
              name: this.tagOptions[entityType.key].find(option => option.key === tagId).original_name,
              organization_name: this.tagOptions[entityType.key].find(option => option.key === tagId).organization_name
            }
          })
        }
      }))
    },
    onTagsSearchInput (entityType, searchText) {
      if (searchText) {
        const data = {
          workspaceId: this.workspaceId,
          query: searchText,
          target_types: ['tag']
        }

        this.fetchMerakiTargetSuggestions(data).then(response => {
          this.$set(this.searchTargetOptions, entityType.key, response.data.data.map(item => {
            return {
              key: item.id,
              name: `${item.organization_name} - ${item.name}`,
              original_name: item.name,
              organization_name: item.organization_name
            }
          }))
        })
      } else {
        this.$set(this.searchTargetOptions, entityType.key, this.emptyQueryTagOptions)
      }
    },
    fetchEmptyQueryTagOptions () {
      this.fetchMerakiTargetSuggestions({
        workspaceId: this.workspaceId,
        query: '',
        target_types: ['tag']
      }).then(response => {
        response.data.data.forEach(item => {
          this.emptyQueryTagOptions.push({
            key: item.id,
            name: `${item.organization_name} - ${item.name}`,
            original_name: item.name,
            organization_name: item.organization_name
          })
        })
      })
    },
    getTagFilterLabel (entityType) {
      return this.$t('v2.nameCompliance.scanWithTheseTags')
        .replace('{entity_type}', entityType.key === 'ssid' ? entityType.name : entityType.name.toLowerCase())
    }
  }
}
</script>

<<style src="./name-compliance-rule-set-target-selection.scss" lang="scss" scoped></style>
