<template lang="pug">
  .top-org-selector(
    data-test="top-org-selector"
    v-click-outside="hideMenu"
  )
    .top-org-selector__selection-trigger(
      @click="onSelectionTriggerClick"
    )
      .top-org-selector__selection-trigger__logo
        img(
          :src="selectedRootNodeLogoUrl"
        )
      span.top-org-selector__selection-trigger__organization-name
        | {{  selectedOrganization.name }}
      span.top-org-selector__selection-trigger__splitter
      v-icon.top-org-selector__selection-trigger__icon(
        v-if="!menuVisible"
      ) arrow_drop_down
      v-icon.top-org-selector__selection-trigger__icon(
        v-if="menuVisible"
      ) arrow_drop_up
    .top-org-selector__organization-menu-container(
      v-show="menuVisible"
    )
      base-text-input.base-text-input--small.top-org-selector__search-input(
        :placeholder="$t('general.search')"
        v-model="search"
      )
        v-icon.top-org-selector__search-input__icon search

      perfect-scrollbar.top-org-selector__scroll-area
        .top-org-selector__sections
          .top-org-selector__sections__section__header
            | {{ $t('v2.layout.organizationSelectorText') }}
          ul.top-org-selector__sections__section__menu
            li.top-org-selector__sections__section__menu__item.new-organization-item(
              @click="onNewOrganizationClick"
            )
              .top-org-selector__sections__section__menu__item__content
                span.top-org-selector__sections__section__menu__item__content__title
                  | {{ $t('general.createNewOrganization') }}
                .top-org-selector__sections__section__menu__item__content__add-icon-container
                  v-icon.top-org-selector__sections__section__menu__item__content__add-icon-container__icon add

            li.top-org-selector__sections__section__menu__item(
              v-for="organization in filteredOrganizations",
              :key="organization.id",
              :class="{'top-org-selector__sections__section__menu__item--active': organizationId === organization.id}"
              @click="onMenuItemClick(organization)"
            )
              .top-org-selector__sections__section__menu__item__content
                span.top-org-selector__sections__section__menu__item__title
                  | {{ organization.name }}
              .top-org-selector__sections__section__menu__item__logo
                img(:src="logoUrl(organization)")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import matchSorter from 'match-sorter'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import orgLogoIcon from '@/components/icons/org-logo-icon'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    BaseTextInput,
    orgLogoIcon
  },
  mixins: [
    NodeSelectionsMixin
  ],
  data () {
    return {
      search: '',
      isLoadFinished: false,
      menuVisible: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    selectedRootNodeLogoUrl () {
      if (this.selectedOrganization.logo && this.selectedOrganization.logo.is_on_dashboard) {
        return this.selectedOrganization.logo.logo_details.url
      }

      return require('@/assets/images/boundless-logo.png')
    },
    filteredOrganizations () {
      return matchSorter(this.captivePortalOrganizations, this.search.toLowerCase(), { keys: ['name'] })
    }
  },
  methods: {
    ...mapActions('user', ['fetchUserRoles']),

    logoUrl (node) {
      if (node.logo && node.logo.is_on_dashboard) {
        return node.logo.logo_details.url
      }

      return require('@/assets/images/boundless-logo.png')
    },
    onMenuItemClick (node) {
      this.menuVisible = false

      if (node.id !== this.organizationId) {
        // Organization changed
        this.selectOrganization(node)
        this.selectNode({ id: node.id })

        EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_CHANGED)
      }

      // Redirect to organization node
      this.redirectToNode(node, this.nodeId)
    },
    onSelectionTriggerClick () {
      this.menuVisible = !this.menuVisible
    },
    hideMenu () {
      this.menuVisible = false
    },
    onNewOrganizationClick () {
      this.$router.push({ name: 'CreateOrganizationModeSelect' })
      this.hideMenu()
    }
  },
  watch: {
    menuVisible (newValue) {
      if (!newValue) {
        this.search = ''
      }

      this.$emit('menuDisplayStateChange', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .top-org-selector {
    width: 100%;

    &__organization-menu-container {
      background-color: #FFF !important;
      box-shadow: 0px 16px 40px rgba(0, 0, 0, 0.1);
    }
    &__selection-trigger {
      padding: 0 0 0 18px;
      cursor: pointer;
      line-height: 55px;
      overflow: hidden;
      user-select: none;

      &__splitter {
        border-right: solid 2px #e2e8f1;
        margin: 7px 0 7px 18px;
        width: 1px;
        height: 40px;
        float: right;
      }

      &__logo {
        padding: 11px 11px 11px 0;
        height: 55px;
        float: left;
        background: #FFF;
        img {
          width: 27px;
          height: 27px;
          object-fit: scale-down;
        }
      }

      &__organization-name {
        font-family: Overpass;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        letter-spacing: 2px;
        color: $text-dark;
        float: left;

        max-width: calc(85% - 47px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &__icon {
        float: right;
        margin-top: 13px;
        color: $gray-medium !important;
      }
    }

    &__scroll-area {
      height: calc(100vh - 146px);
    }

    &__sections {
      &__section {
        &__header {
          padding: 0 35px 0 45px;
          background-color: $blue-dark;
          color: white;

          height: 37px;
          line-height: 37px;

          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          position: relative;
        }

        &__menu {
          list-style: none;
          padding-left: 0;

          &__item {
            height: 37px;
            line-height: 37px;
            cursor: pointer;

            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            color: $text-dark;
            position: relative;

            &__content {
              padding: 0 35px 0 45px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              &__title {
                float: left;
              }

              &__add-icon-container {
                float: right;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                margin-top: 10px;
                border: 1px solid $green-medium;
                border-radius: 4px;

                &__icon {
                  font-size: 14px !important;
                  color: $green-medium !important;
                  line-height: 19px !important;
                }
              }
            }

            &__logo {
              position: absolute;
              right: 29px;
              top: 5px;
              bottom: 5px;
              width: 27px;
              height: 27px;
              padding: 2px;
              background: #FFF;
              img {
                width: 22px;
                height: 22px;
                object-fit: scale-down;
              }
            }

            &--active {
              background: #1146AE;
              color: #FFF;
              font-weight: bold;
            }

            &:hover {
              background: $gray-xlight;
            }

            &.new-organization-item {
              color: $green-medium;
            }
          }
        }
      }
    }

    &__search-input {
      &__icon {
        color: $text-dark !important;
        right: 12px !important;
      }
    }

    .base-text-input ::v-deep {
      input {
        background: $gray-xlight;
        height: 51px;
        color: $text-dark;
        border: none;
        padding: 9px 54px 9px 45px;
        border-radius: 0;

        &::placeholder {
          color: $text-dark !important;
        }

        &:focus {
          border-color: $green-light;
        }
      }

      .v-icon {
        opacity: 1;
        right: 34px !important;
      }
    }

    ::v-deep {
      .ps .ps__rail-y:hover, .ps .ps__rail-y:focus, .ps .ps__rail-y.ps--clicking {
        background: transparent;
      }
    }
  }
</style>
