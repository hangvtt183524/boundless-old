<template lang="pug">
  .dashboard-entity-item(
    :class="{'dashboard-entity-item--no-children': !hasChildren, 'dashboard-entity-item--inner': depth > 0, 'dashboard-entity-item--open': childrenVisible, 'dashboard-entity-item--active': selectedEntity === entity}"
  )
    .dashboard-entity-item__header
      .dashboard-entity-item__header__expand-trigger(
        v-if="hasChildren"
        @click="onExpandTriggerClick"
      )
        v-icon.show-icon(
          :class="{'show-icon': !childrenVisible, 'hide-icon': childrenVisible}"
        ) {{ childrenVisible ? 'remove' : 'add' }}

      .dashboard-entity-item__header__select-trigger(
        @click="onSelectTriggerClick"
      )
        .dashboard-entity-item__header__select-trigger__title
          | {{ $t(`v2.dashboard.entities.${entity.key}`) }}

    transition( name="slide")
      .dashboard-entity-item__children-container(
        v-if="hasChildren"
        v-show="childrenVisible"
      )
        dashboard-entity-item.dashboard-entity-item__child-item(
          v-for="child of entity.children"
          :key="child.key"
          :entity="child"
          :depth="depth + 1"
          :selected-entity="selectedEntity"
          @entitySelect="onChildEntitySelect"
        )
</template>

<script>
export default {
  name: 'dashboard-entity-item',
  props: {
    entity: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    },
    selectedEntity: {
      type: Object
    }
  },
  data: function () {
    return {
      childrenVisible: false
    }
  },
  computed: {
    hasChildren () {
      return this.entity.children && this.entity.children.length > 0
    }
  },
  methods: {
    onExpandTriggerClick () {
      this.childrenVisible = !this.childrenVisible
    },
    onSelectTriggerClick () {
      this.$emit('entitySelect', this.entity)
    },
    onChildEntitySelect (entity) {
      this.$emit('entitySelect', entity)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-entity-item {
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
          user-select: none;
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
      .dashboard-entity-item__header {
        &__select-trigger {
          padding-left: 35px;
          margin-left: 0;
        }
      }
    }

    &--inner {
      .dashboard-entity-item__header {
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

      .dashboard-entity-item__children-container {
        padding-left: 31px;
      }

      &.dashboard-entity-item--no-children {
        .dashboard-entity-item__header {
          &__select-trigger {
            padding-left: 31px;
            margin-left: 0;
          }
        }
      }
    }

    &--open {
      .dashboard-entity-item__header {
        border-left: 1px solid $gray-medium;
      }
    }

    &--active > .dashboard-entity-item__header {
      .dashboard-entity-item__header__select-trigger {
        background-color: $gray-xlight;
        color: $text-dark;
        font-weight: bold;
      }
    }

    .slide-enter-active {
      transition: all 0.5s;
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
