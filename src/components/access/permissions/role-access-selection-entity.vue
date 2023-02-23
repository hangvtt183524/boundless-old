<template lang="pug">
  .role-access-selection-entity(
    v-show="isVisible"
    :class="[{'role-access-selection-entity--no-children': !hasChildren, 'role-access-selection-entity--inner': depth > 0, 'role-access-selection-entity--open': childrenVisible, 'role-access-selection-entity--fixed': isFixed}, `role-access-selection-entity--depth-${depth}`]"
  )
    .role-access-selection-entity__header
      .role-access-selection-entity__header__expand-trigger(
        v-if="hasChildren"
        @click="onExpandTriggerClick"
      )
        v-icon.show-icon(
          :class="{'show-icon': !childrenVisible, 'hide-icon': childrenVisible}"
        ) {{ childrenVisible ? 'remove' : 'add' }}

      base-check-box.role-access-selection-entity__header__check-box(
        v-if="!isFixed"
        :value="isSelected"
        @input="onSelectionInput"
      )

      .role-access-selection-entity__header__title
        | {{ entity.key }}

    transition( name="slide")
      .role-access-selection-entity__children-container(
        v-if="hasChildren"
        v-show="childrenVisible"
      )
        role-access-selection-entity.role-access-selection-entity__child-entity(
          v-for="child of entity.children"
          :key="child.key"
          :entity="child"
          :value="getEntityValue(child, value)"
          @input="onChildEntityInput(child.key, $event)"
          :depth="depth + 1"
          :search="matchesSearch ? null : search"
          :is-fixed="isFixed"
        )
</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'

export default {
  name: 'role-access-selection-entity',
  components: {
    BaseCheckBox
  },
  props: {
    entity: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: false
    },
    depth: {
      type: Number,
      default: 0
    },
    search: {
      type: String,
      required: false
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      childrenVisible: false,
      fullAccessValue: 'full'
    }
  },
  computed: {
    hasChildren () {
      return this.entity.children && this.entity.children.length > 0
    },
    matchesSearch () {
      // If a search query is provided and the current entity matches the search, we won't forward search query to
      // its children so that all of them will be visible
      return !!this.search &&
        this.entity.key.toLowerCase().indexOf(this.search.toLowerCase()) > -1
    },
    isVisible () {
      return this.isEntityVisible(this.entity)
    },
    isSelected () {
      return this.isEntitySelected(this.entity, this.value)
    }
  },
  methods: {
    onExpandTriggerClick () {
      this.childrenVisible = !this.childrenVisible
    },
    getEntityValue (entity, parentValue) {
      return (parentValue ? parentValue.children : []).find(item => item.key === entity.key)
    },
    isEntityVisible (entity) {
      // If no search text present, or if this entity or any of its children contain the search key
      return !this.search ||
        entity.key.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
        (entity.children && entity.children.filter(child => this.isEntityVisible(child)).length > 0)
    },
    isEntitySelected (entity, value) {
      // true either if entity is selected and is a leaf node, or all its descendants are selected
      return (entity.children && entity.children.length > 0)
        ? entity.children.filter(childEntity => {
          return !this.isEntitySelected(childEntity, this.getEntityValue(childEntity, value))
        }).length === 0
        : !!value
    },
    getEntitySelectionValueWithDescendants (entity) {
      return {
        ...entity,
        access: this.fullAccessValue,
        children: (entity.children || []).map(child => this.getEntitySelectionValueWithDescendants(child))
      }
    },
    onChildEntityInput (childEntityKey, value) {
      const existingChildren = (this.value && this.value.children ? this.value.children : [])
      let updatedChildren

      if (value) {
        // Child selected
        updatedChildren = existingChildren.find(child => child.key === value.key)
          ? existingChildren.map(childValue => {
            // Return existing value for other items, new value for updated item
            return childValue.key === value.key ? value : childValue
          })
          : existingChildren.concat([value])
      } else {
        // Child de-selected
        updatedChildren = existingChildren.filter(child => child.key !== childEntityKey)
      }

      // If child already part of entity selection value, replace it with new value. Otherwise add it to children
      this.$emit('input', {
        ...this.entity,
        access: this.fullAccessValue,
        children: updatedChildren
      })
    },
    onSelectionInput (isSelected) {
      if (isSelected) {
        if (!this.hasChildren) {
          // Leaf item
          this.$emit('input', {
            ...this.entity,
            access: this.fullAccessValue
          })
        } else {
          // Parent item
          this.$emit('input', this.getEntitySelectionValueWithDescendants(this.entity))
        }
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.role-access-selection-entity {
  width: 100%;

  &__header {
    height: 36px;
    border-bottom: 1px solid $gray-medium;
    overflow: hidden;

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

    &__check-box {
      margin-left: 10px;
      margin-top: 8px;
      float: left;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 36px;
      color: $text-dark;
      cursor: pointer;
      text-transform: capitalize;

      padding-left: 10px;
      padding-right: 10px;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      user-select: none;
    }

    &:hover {
      background: $gray-xlight;
    }
  }

  &__children-container {
    padding-left: 35px;
  }

  &--no-children {
    .role-access-selection-entity__header {
      &__select-trigger {
        padding-left: 35px;
        margin-left: 0;
      }
    }
  }

  &--inner {
    .role-access-selection-entity__header {
      height: 32px;
      border-bottom: 1px solid rgba(#4c83f0, .3);

      &__expand-trigger {
        width: 31px;
        height: 31px;

        .v-icon {
          line-height: 31px;
        }
      }

      &__check-box {
        margin-top: 6px;
      }

      &__title {
        font-size: 14px;
        line-height: 32px;
      }
    }

    .role-access-selection-entity__children-container {
      padding-left: 31px;
    }

    &.role-access-selection-entity--no-children {
      .role-access-selection-entity__header {
        &__title {
          margin-left: 0;
        }
      }
    }
  }

  &--depth-2 {
    .role-access-selection-entity__header {
      &__check-box {
        margin-left: 40px;
      }
    }
  }

  &--depth-3 {
    .role-access-selection-entity__header {
      &__check-box {
        margin-left: 80px;
      }
    }
  }

  &--fixed {
    .role-access-selection-entity--inner {
      .role-access-selection-entity__header {
        &__title {
          margin-left: 30px;
        }
      }
    }
  }

  &--open {
    .role-access-selection-entity__header {
      border-left: 1px solid $gray-medium;
    }
  }

  &--active > .role-access-selection-entity__header {
    .role-access-selection-entity__header__title {
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
