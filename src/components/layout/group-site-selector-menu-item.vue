<template lang="pug">
  .node-selector-item(
    :class="{'node-selector-item--no-children': !hasChildren, 'node-selector-item--inner': depth > 0, 'node-selector-item--open': childrenVisible, 'node-selector-item--active': node.id === selectedNodeId}"
    v-show="isVisible"
  )
    .node-selector-item__header
      .node-selector-item__header__expand-trigger(
        v-if="hasChildren"
        @click="onExpandTriggerClick"
      )
        v-icon.show-icon(
          :class="{'show-icon': !childrenVisible, 'hide-icon': childrenVisible}"
        ) {{ childrenVisible ? 'remove' : 'add' }}
      .node-selector-item__header__select-trigger(
        @click="onSelectTriggerClick"
      )
        .node-selector-item__header__select-trigger__title
          | {{ node.name }}
    transition( name="slide")
      .node-selector-item__children-container(
        v-if="hasChildren"
        v-show="childrenVisible"
      )
        group-site-selector-menu-item.node-selector-item__child-item(
          v-for="child of node.children"
          :key="child.id"
          :node="child"
          :depth="depth + 1"
          :selected-node-id="selectedNodeId"
          :name-filter="nameFilter"
          @nodeSelect="onChildNodeSelect"
        )
</template>

<script>
export default {
  name: 'group-site-selector-menu-item',
  props: {
    node: {
      type: Object,
      required: true
    },
    selectedNodeId: {
      type: Number
    },
    depth: {
      type: Number,
      default: 0
    },
    nameFilter: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      childrenVisible: false
    }
  },
  computed: {
    hasChildren () {
      return this.node.children && this.node.children.length > 0
    },
    isVisible () {
      if (!this.nameFilter) {
        return true
      }

      return this.containsNameFilter(this.node)
    }
  },
  methods: {
    containsNameFilter (root) {
      if (root.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) > -1) {
        return true
      }

      if (root.children && root.children.length > 0) {
        for (let i = 0; i < root.children.length; i++) {
          if (this.containsNameFilter(root.children[i])) {
            return true
          }
        }
      }

      return false
    },
    onExpandTriggerClick () {
      this.childrenVisible = !this.childrenVisible
    },
    onSelectTriggerClick () {
      this.$emit('nodeSelect', this.node)
    },
    onChildNodeSelect (node) {
      this.$emit('nodeSelect', node)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .node-selector-item {
    width: 100%;

    &__header {
      height: 36px;
      border-bottom: 1px solid $gray-medium;

      &__expand-trigger {
        width: 35px;
        height: 35px;
        text-align: center;
        cursor: pointer;
        background-color: #2260DD;
        user-select: none;
        float: left;

        .v-icon {
          color: $gray-xlight;
          font-size: 14px;
          font-weight: bold;
          line-height: 35px;
          transition: transform 0.25s ease-out;

          &.show-icon {
            transform: rotate(90deg);
          }
          &.hide-icon {
            transform: rotate(180deg);
          }
        }
      }

      &__select-trigger {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 36px;
        color: $text-dark;
        cursor: pointer;
        margin-left: 35px;

        &__title {
          padding-left: 10px;
          padding-right: 10px;

          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      &:hover {
        background: $gray-xlight;
      }
    }

    &__children-container {
      padding-left: 35px;
    }

    &--no-children {
      .node-selector-item__header {
        &__select-trigger {
          padding-left: 35px;
          margin-left: 0;
        }
      }
    }

    &--inner {
      .node-selector-item__header {
        height: 32px;
        border-bottom: 1px solid rgba(#4c83f0, .3);

        &__expand-trigger {
          width: 31px;
          height: 31px;

          .v-icon {
            line-height: 31px;
          }
        }

        &__select-trigger {
          font-size: 14px;
          line-height: 32px;
          margin-left: 31px;
        }
      }

      .node-selector-item__children-container {
        padding-left: 31px;
      }

      &.node-selector-item--no-children {
        .node-selector-item__header {
          &__select-trigger {
            padding-left: 31px;
            margin-left: 0;
          }
        }
      }
    }

    &--open {
      background-color: $gray-xlight;

      .node-selector-item__header {
        border-bottom: 1px solid rgba(#4c83f0, .3);
      }
    }

    &--active > .node-selector-item__header {
      .node-selector-item__header__select-trigger {
        background-color: $gray-xlight;
        color: $text-dark;
        font-weight: bold;
      }
    }

    .slide-enter-active {
      transition: all 3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition: all 0.3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 520px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      max-height: 0;
      overflow: hidden;
    }
  }
</style>
