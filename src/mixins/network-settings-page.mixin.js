// Mixin providing common functionality for pages that contain Meraki network settings
import categories from '@/components/meraki/templates/template-detail/setting-categories'

export default {
  data: function () {
    return {
      selectedSection: null,
      settingComponents: {},
      isSettingDetailView: false,
      settingDetailTitle: null
    }
  },
  computed: {
    visibleCategories () {
      // Return sections that have settings defined in them
      return categories.filter(category => {
        return category.sections.filter(section => {
          return section.settings.length > 0
        }).length > 0
      }).map(category => {
        return {
          ...category,
          sections: category.sections.filter(section => {
            return section.settings.length > 0
          })
        }
      })
    }
  },
  watch: {
    selectedSection: {
      handler: function () {
        // Load setting components defined in section
        this.selectedSection.settings.forEach(setting => {
          if (!this.settingComponents[setting]) {
            this.loadSettingComponent(setting)
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    isComponentRenderEnabled (componentKey) {
      return this.settingComponents.hasOwnProperty(componentKey)
    },
    onSectionSelect (section) {
      this.$set(this, 'selectedSection', section)

      // Reset detail view flag on section select
      this.$set(this, 'isSettingDetailView', false)
    },
    loadSettingComponent (componentKey) {
      import(`../components/meraki/templates/template-setting-items/${componentKey}.vue`).then(component => {
        this.$set(this.settingComponents, componentKey, component.default) // Don't know why we need "default" here
      })
    },
    onSettingDetailViewToggle (isDetailView, detailItemTitle) {
      this.$set(this, 'isSettingDetailView', isDetailView)
      this.$set(this, 'settingDetailTitle', detailItemTitle)
    },
    onSettingBackClick () {
      // Call onBackClick method on child setting items
      this.selectedSection.settings.forEach(setting => {
        this.$refs[`setting_${setting}`][0].onBackClick()
      })
    }
  }
}
