<template lang="pug">
#sidebar
  v-navigation-drawer.sidebar(
    fixed
    app
    width='240'
  )
    vue-perfect-scrollbar.drawer-menu--scroll
      .logo
        img.logo-image(:src='logoUrl')

      ul.doc-list
        li.doc-item(
          v-for="(item, index) in docList",
          :class="{'active': isActive(item, index)}"
          @click="onSelectItem(item)"
        )
          h3.doc-item-text {{ item.title }}
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import DocumentationList from '@/api/documentation-list.js'

export default {
  name: 'sidebar',
  data () {
    return {
      docList: DocumentationList,
      selectedItem: null
    }
  },
  components: {
    VuePerfectScrollbar,
    DocumentationList
  },
  computed: {
    logoUrl () {
      return require('@/assets/images/logo-main.svg')
    }
  },
  methods: {
    isActive (item, index) {
      if (!this.selectedItem) {
        if (index === 0) {
          return true
        } else {
          return false
        }
      }
      if (item.id === this.selectedItem.id) return true
      return false
    },
    onSelectItem (item) {
      this.selectedItem = item
      this.$emit('setDocument', item)
    }
  }
}
</script>

<style lang="scss">
#sidebar {
  .sidebar {
    padding-bottom: 0;
    background: #548ef2;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.35);
  }
  .logo {
    height: 200px;
    text-align: center;
    .logo-image {
      height: 100%;
    }
  }
  .doc-list {
    padding: 30px 30px 0;
    list-style: none;
    .doc-item {
      cursor: pointer;
      margin-bottom: 20px;
      .doc-item-text {
        font-size: 16px;
        color: #97b8f6;
        &:hover {
          color: white;
        }
      }
    }
    .active {
      position: relative;
      ::after {
        position: absolute;
        content: '';
        width: 20px;
        left: 10px;
        top: 26px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        height: 3px;
        bottom: 18px;
        background-color: #62d862;
      }
      .doc-item-text {
        color: white;
      }
    }
  }
}
</style>
