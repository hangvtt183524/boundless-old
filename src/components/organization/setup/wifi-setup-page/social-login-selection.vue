<template lang="pug">
  .social-login-selection
    .social-login-selection__header(
      @click="onExpandTriggerClick"
    )
      .social-login-selection__header__title
        | {{ $t('v2.organization.setup.configureWalledGarden') }}
      v-icon.social-login-selection__header__expand-trigger(
        :class="{'show-icon': !isExpanded, 'hide-icon': isExpanded}"
      ) {{ isExpanded ? 'remove' : 'add' }}
    transition(name="slide")
      .social-login-selection__content(
        v-show="isExpanded === true"
      )
        .social-login-selection__content__items
          .social-login-selection__content__items__item(
            v-for="provider of providers"
            :key="provider.key"
          )
            v-layout(row wrap @click="onClickProviderRow(provider)")
              v-flex(xs6 md4 lg3)
                base-check-box(
                  v-model="provider.selected"
                  :label="provider.label"
                  @input="onSelectionChange"
                )
              v-flex(xs6 md8 lg9)
                v-icon(
                  :class="`${provider.key} fab fa-${provider.key}`"
                )

        .social-login-selection__content__disclaimer(
          v-show="isGoogleSelected"
        )
          | {{ $t('v2.organization.setup.googleWalledGardenDisclaimer') }}

</template>

<script>
import BaseCheckBox from '../../../v2/base-check-box/base-check-box'
export default {
  name: 'social-login-selection',
  components: {
    BaseCheckBox
  },
  data: function () {
    return {
      isExpanded: false,
      providers: [
        {
          key: 'facebook',
          label: 'Facebook',
          selected: true
        },
        {
          key: 'instagram',
          label: 'Instagram',
          selected: true
        },
        {
          key: 'linkedin',
          label: 'Linkedin',
          selected: true
        },
        {
          key: 'twitter',
          label: 'Twitter',
          selected: true
        },
        {
          key: 'google',
          label: 'Google',
          selected: false
        }
      ]
    }
  },
  mounted () {
    // Emit initial selections
    this.onSelectionChange()
  },
  computed: {
    isGoogleSelected () {
      return this.providers.filter(provider => {
        return provider.key === 'google' && provider.selected === true
      }).length > 0
    }
  },
  methods: {
    onExpandTriggerClick () {
      this.isExpanded = !this.isExpanded
    },
    onClickProviderRow (provider) {
      provider.selected = !provider.selected
      this.onSelectionChange()
    },
    onSelectionChange () {
      this.$emit('selectionChange', this.providers.filter(provider => {
        return provider.selected === true
      }).map(provider => {
        return provider.key
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";
  @import "../../../../styles/v2/base";

  .social-login-selection {
    border: 1px solid $gray-medium;
    border-bottom-width: 3px;
    box-sizing: border-box;
    background-color: $white;
    box-shadow: 5px 0 10px rgba(0, 0, 0, 0.05);

    &__header {
      height: 48px;
      line-height: 48px;
      padding: 0 16px;
      overflow: hidden;
      user-select: none;
      cursor: pointer;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        color: $text-medium;
        float: left;
      }

      &__expand-trigger {
        font-size: 20px;
        line-height: 48px;
        color: $text-medium;
        transition: transform 0.25s ease-out;
        float: right;

        &.show-icon {
          transform: rotate(90deg);
        }
        &.hide-icon {
          transform: rotate(180deg);
        }
      }
    }

    &__content {
      &__items {
        margin-top: 10px;

        &__item {
          line-height: 32px;
          height: 32px;
          padding: 0 12px;
          background-color: $white;

          .base-check-box {
            height: 20px;
            line-height: 20px;
            margin-top: 6px;
          }

          .v-icon {
            line-height: 32px;
            font-size: 18px;
          }
        }

        &__item:nth-child(2n + 1) {
          background-color: rgba($gray-xlight, .5);
        }
      }

      &__disclaimer {
        padding: 10px 0;
        margin-left: 45px;
        border-top: 2px solid $gray-medium;

        font-family: Fira Sans;
        font-style: italic;
        font-weight: normal;
        font-size: 13px;
        line-height: 20px;
        color: black;
      }
    }

    .slide-enter-active {
      transition: all 0.3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition: all 0.3s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-enter-to, .slide-leave {
      max-height: 320px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      max-height: 0;
      overflow: hidden;
    }
  }
</style>
