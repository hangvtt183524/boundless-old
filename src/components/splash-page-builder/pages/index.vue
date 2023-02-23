<template lang="pug">
  .screen-center-ie11-wrapper
    .screen-center(
      @click="hideContextMenu"
      @contextmenu.prevent="showContextMenu"
      :class="[{ 'wifi4eu': selectedPage.name === 'Wifi4eu' }]"
    )
      logo(
        :selected-item="selectedItem"
        :page-config="pageConfig"
        :component="pageConfig.logo"
        :config="pageConfig.logo.config"
        :selected-page="selectedPage"
        @select="selectItem"
        v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
      )
      component(
        :is="selectedPage.component",
        :page-config="pageConfig"
        :lang="lang"
        :default-lang="defaultLang"
        :selected-item="selectedItem"
        :selected-page="selectedPage"
        @select="selectItem"
      )
      ul(
        class="context-menu"
        ref="contextMenu"
      )
        li(
          @click.stop="buildLink"
        ) {{$t('builder.buildLink')}}
</template>

<script>
import guestForm from './guest-wifi/guest-form'
import ticketing from './guest-wifi/ticketing'
import codes from './guest-wifi/codes'
import guestSocial from './guest-wifi/guest-social'
import sso from './guest-wifi/sso'
import smsAccessCode from './sms-access/sms-access-code'
import smsRegistration from './sms-access/sms-registration'
import userLogin from './userpwd/user-login'
import sponsorAuth from './sponsoring/sponsor-auth'
import sponsorCode from './sponsoring/sponsor-code'
import sponsorPage from './sponsoring/sponsor-page'
import sponsorWait from './sponsoring/sponsor-wait'
import accessGrantedPage from './generic/access-granted-page'
import wifiUnavailablePage from './generic/wifi-unavailable-page'
import wifi4eu from './wifi4eu/wifi4eu'
import logo from '../components/logo'

import optionTranslationMixin from '../mixins/option-translation-mixin'

export default {
  props: ['pageConfig', 'lang', 'defaultLang', 'selectedItem', 'selectedPage'],
  mixins: [optionTranslationMixin],
  components: {
    guestForm,
    ticketing,
    codes,
    sso,
    guestSocial,
    smsRegistration,
    smsAccessCode,
    userLogin,
    sponsorAuth,
    sponsorCode,
    sponsorWait,
    sponsorPage,
    accessGrantedPage,
    wifiUnavailablePage,
    wifi4eu,
    logo
  },
  data () {
    return {
      selRange: null
    }
  },
  computed: {
    selectedPageInfo () {
      return this.pageConfig.pages[this.selectedPage.configKey]
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    showContextMenu ($event) {
      let iFrameEle = document.activeElement
      var idoc = iFrameEle.contentDocument || iFrameEle.contentWindow.document

      if (typeof idoc.getSelection === 'function' && ['heading', 'terms-checkbox'].indexOf(this.selectedItem.component) !== -1) {
        var selObj = idoc.getSelection()
        var selRange = selObj.getRangeAt(0)
        if (selRange.startContainer !== selRange.endContainer || selRange.startOffset !== selRange.endOffset) {
          this.selRange = selRange
          let menu = this.$refs.contextMenu
          let contextMenuWidth, contextMenuHeight

          contextMenuWidth = menu.offsetWidth
          contextMenuHeight = menu.offsetHeight

          if ((contextMenuWidth + $event.pageX) >= window.innerWidth) {
            menu.style.left = ($event.pageX - contextMenuWidth) + 'px'
          } else {
            menu.style.left = $event.pageX + 'px'
          }

          if ((contextMenuHeight + $event.pageY) >= window.innerHeight) {
            menu.style.top = ($event.pageY - contextMenuHeight) + 'px'
          } else {
            menu.style.top = $event.pageY + 'px'
          }

          menu.classList.add('active')
        }
      }
    },
    hideContextMenu ($event) {
      this.$refs.contextMenu.classList.remove('active')
    },
    buildLink ($event) {
      try {
        $event.preventDefault()
        this.hideContextMenu()

        if (this.selRange) {
          var selRange = this.selRange

          let contentEditable = selRange.startContainer.parentNode
          if (contentEditable.contentEditable !== 'true') {
            contentEditable = contentEditable.parentNode
          }

          if (contentEditable) {
            let started = false
            let ended = false
            let collectedText = ''
            var children = contentEditable.childNodes
            children.forEach(function (item) {
              let isStartNode = (item === selRange.startContainer || item === selRange.startContainer.parentNode)
              let isEndNode = (item === selRange.endContainer || item === selRange.endContainer.parentNode)
              if (isStartNode && isEndNode) {
                collectedText += item.textContent.slice(0, selRange.startOffset)
                collectedText += '<' + item.textContent.slice(selRange.startOffset, selRange.endOffset) + '>'
                collectedText += item.textContent.slice(selRange.endOffset, item.textContent.length)
              } else if (isStartNode) {
                collectedText += item.textContent.slice(0, selRange.startOffset)
                collectedText += '<' + item.textContent.slice(selRange.startOffset, item.textContent.length)
              } else if (isEndNode) {
                collectedText += item.textContent.slice(0, selRange.endOffset) + '>'
                collectedText += item.textContent.slice(selRange.endOffset, item.textContent.length)
              } else if (started && !ended) {
                collectedText += item.textContent
              } else {
                if (item.nodeType !== Node.TEXT_NODE && item.textContent.length) {
                  collectedText += ('<' + item.textContent + '>')
                } else {
                  collectedText += item.textContent
                }
              }

              if (isStartNode) {
                started = true
              }
              if (isEndNode) {
                ended = true
              }
            })
            if (this.selectedItem.component === 'heading') {
              this.selectedItem.updatedByBuildLink = true
              this.translated.title = collectedText
            } else if (this.selectedItem.component === 'terms-checkbox') {
              this.selectedItem.updatedByBuildLink = true
              this.translated.label = collectedText
            }
          }
        } else {
          alert('getSelection function is not valid')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
