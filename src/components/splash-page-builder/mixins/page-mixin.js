import components from '../components'

import textInputStub from '../stubs/text-input'
import selectInputStub from '../stubs/select-input'
import linkStub from '../stubs/link'
import headingStub from '../stubs/heading'
import textParagraphStub from '../stubs/text-paragraph'
import facebookButtonStub from '../stubs/facebook-button'
import googleButtonStub from '../stubs/google-button'
import instagramButtonStub from '../stubs/instagram-button'
import linkedInButtonStub from '../stubs/linkedin-button'
import twitterButtonStub from '../stubs/twitter-button'

import arrayMove from '@/utils/array-move'
import { Sortable } from 'sortablejs'

import { initTranslation } from '../translation-manager'

let PageMixin = {
  props: ['selectedItem', 'pageConfig', 'lang', 'defaultLang', 'selectedPage'],
  components,
  data () {
    return {
      showInputSelector: false,
      selectedInput: 'text-input'
    }
  },
  mounted () {
    try {
      if (this.enableSorting) {
        let vm = this
        let sortable = new Sortable(this.$refs.sortableContainer, {
          group: 'name',
          sort: true,
          delay: 0,
          touchStartThreshold: 0,
          draggable: '.sortable',
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          filter: '.action-block',
          // this fixes firefox redirect issue
          setData: function (dataTransfer, dragEl) {
            dataTransfer.setData('text/html', dragEl.innerHTML)
          },
          // Element dragging ended
          onEnd: function (evt) {
            vm.pageConfig.pages[vm.selectedPage.configKey].children = arrayMove(vm.pageConfig.pages[vm.selectedPage.configKey].children, evt.oldIndex, evt.newIndex)
          }
        })
        console.log('sortable', sortable)
      }
      this.$eventHub.$on('add-component', (componentName) => {
        this.selectedInput = componentName
        this.addInput()
      })
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    componentMapper (componentName) {
      let socialButtons = [
        'facebook-button',
        'instagram-button',
        'google-button',
        'linkedin-button',
        'twitter-button',
        'email-button'
      ]
      if (socialButtons.indexOf(componentName) !== -1) {
        return 'social-button'
      }
      return componentName
    },
    addInput () {
      let highestId = this.pageConfig.pages[this.selectedPage.configKey].children.reduce(function (previous, entry) {
        return previous === undefined || entry.id > previous ? entry.id : previous
      }, undefined)
      if (highestId) {
        let configStub = global._.cloneDeep(this.getStub(this.selectedInput))
        initTranslation(configStub, this.defaultLang)

        let input = {
          id: highestId + 1,
          component: this.selectedInput,
          config: configStub,
          dynamic: true
        }

        this.pageConfig.pages[this.selectedPage.configKey].children.push(input)
        this.showInputSelector = false
      }
    },
    getStub (type) {
      const textToStub = {
        'select-input': selectInputStub,
        'base-link': linkStub,
        'heading': headingStub,
        'text-paragraph': textParagraphStub,
        'facebook-button': facebookButtonStub,
        'google-button': googleButtonStub,
        'instagram-button': instagramButtonStub,
        'linkedin-button': linkedInButtonStub,
        'twitter-button': twitterButtonStub,
        'text-input': textInputStub
      }
      return textToStub[type] || textInputStub
    }
  }

}

export default PageMixin
