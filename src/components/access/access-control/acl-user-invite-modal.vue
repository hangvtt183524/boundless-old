<template lang="pug">
  base-modal(
    class="acl-user-invite-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.acl-user-invite-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.acl-user-invite-modal__title
              | {{ $t('v2.access.inviteNewUsers') }}

    template(v-slot:default)
      div.acl-user-invite-modal__content
        .acl-user-invite-modal__content__description
          | {{ $t('v2.access.inviteNewUsersDescription') }}

        base-table.acl-user-invite-modal__content__table(
          :items="userTableItems"
          :headers="tableHeaders"
          :actions="tableActions"
          :always-editable="true"
          @actionClick="onTableActionClick"
          @itemInput="onTableItemInput"
          :actions-label="$t('general.remove')"
          generate-keys
          ref="usersTable"
        )

        span.acl-user-invite-modal__content__add-item-trigger(
          @click="addNewUser"
        ) + {{ $t('general.addNew') }}

    template(v-slot:footer)
      div.acl-user-invite-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onAddClick"
              :disabled="!isValid"
            ) {{ $t('v2.access.addUsersToAcl') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.full-screen-loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import { isValidEmail } from '@/utils/form-fields-validation-rules'

export default {
  name: 'acl-user-invite-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  data: function () {
    return {
      show: false,
      resolve: null,
      reject: null,
      loading: false,
      users: [],
      tableHeaders: [
        {
          text: this.$t('general.firstName'),
          value: 'first_name',
          editable: true,
          type: String,
          placeholder: this.$t('general.firstName'),
          validations: {
            required: true
          }
        },
        {
          text: this.$t('general.lastName'),
          value: 'last_name',
          editable: true,
          type: String,
          placeholder: this.$t('general.lastName'),
          validations: {
            required: true
          }
        },
        {
          text: this.$t('general.email'),
          value: 'email',
          editable: true,
          type: String,
          placeholder: this.$t('general.emailAddress'),
          validations: {
            required: true,
            methods: [{
              method: isValidEmail
            }]
          }
        }
      ],
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ],
      computeCounter: 0
    }
  },
  computed: {
    isValid () {
      return this.users.length > 0 &&
        this.users.filter(user => !user.first_name || !user.last_name || !user.email || !isValidEmail(user.email)).length === 0
    },
    userTableItems () {
      // eslint-disable-next-line no-unused-expressions
      this.computeCounter

      return this.users.length > 0 ? this.users : [this.getEmptyUserItem()]
    }
  },
  methods: {
    open () {
      this.users = []
      this.show = true

      this.setInitialFocus()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onAddClick () {
      this.resolve(this.users)
      this.show = false
    },
    onCancelClick () {
      this.resolve(false)
      this.show = false
    },
    close () {
      this.show = false
    },
    getEmptyUserItem () {
      return {
        email: null,
        first_name: null,
        last_name: null
      }
    },
    addNewUser () {
      if (this.users.length === 0) {
        // Do twice if the list is already empty, as one item is displayed as placeholder already
        setTimeout(() => {
          this.users.push(this.getEmptyUserItem())
        }, 50)
      }

      this.users.push(this.getEmptyUserItem())

      this.setInitialFocus()
    },
    onTableItemInput (tableItem, field, value) {
      // If inputted a value for placeholder item, add it to the list of items first
      if (this.users.length === 0) {
        this.users.push(tableItem)
      }

      this.$set(tableItem, field, value)
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        if (this.users.length === 0) {
          this.computeCounter += 1 // Force re-compute of table items so that row re-renders
        } else {
          this.users = this.users.filter(user => user !== tableItem)
        }
      }
    },
    setInitialFocus () {
      setTimeout(() => {
        this.$refs.usersTable.setFocus()
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .acl-user-invite-modal {
    position: relative;

    &__header {
      padding: 30px 0;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      &__description {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 40px;
      }

      &__table {
        margin-top: 20px;
      }

      &__add-item-trigger {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 35px;
        text-decoration-line: underline;
        color: $green-medium;
        cursor: pointer;
      }

    }

    &__footer {
      padding: 30px;
      text-align: center;

      &__warning, &__sub-warning {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 20px;
      }

      &__warning {
        margin-bottom: 20px;
      }

      &__sub-warning {
        margin-top: 20px;
      }

      .base-button {
        margin-right: 24px;
        padding: 0 20px;
      }
    }
  }

</style>
