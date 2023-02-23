<template lang="pug">
  .user-invitation-form
    v-container(grid-list-md)
      v-layout(
        row wrap
        :key="resetCounter"
      )
        v-flex(xs6 lg4)
          base-text-input(
            v-model="name"
            :label="$t('general.name')"
            :validations="{ required: true }"
            :placeholder="$t('v2.user.fullName')"
            @enterKeyUp="onEnterKeyUp"
          )
        v-flex(xs6 lg4)
          base-text-input(
            v-model="email"
            :label="$t('general.email')"
            :validations="emailFieldValidations"
            :placeholder="$t('v2.user.emailAddress')"
            @enterKeyUp="onEnterKeyUp"
          )
        v-flex(xs6 lg4)
          base-button.base-button--blue(
            @click="onAddNewUserClick"
            :disabled="!isValid"
          )
            | {{ $t('v2.access.addNewUser') }}

</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import { isValidEmail } from '@/utils/form-fields-validation-rules'

export default {
  name: 'user-invitation-form',
  components: {
    BaseButton,
    BaseTextInput
  },
  data () {
    return {
      name: null,
      email: null,
      emailFieldValidations: {
        required: true,
        method: isValidEmail
      },
      resetCounter: 0 // Re-render after each reset so we reset validation state as well
    }
  },
  computed: {
    isValid () {
      return !!this.name && !!this.email && isValidEmail(this.email)
    }
  },
  methods: {
    onAddNewUserClick () {
      this.$emit('addUserClick', {
        name: this.name,
        email: this.email
      })

      // Clear form
      this.reset()
    },
    onEnterKeyUp () {
      if (!this.isValid) {
        return false
      }

      this.onAddNewUserClick()
    },
    reset () {
      this.name = null
      this.email = null

      this.resetCounter += 1
    }
  }
}
</script>

<style lang="scss" scoped>

.user-invitation-form {
  .base-button {
    padding: 0 20px;
    margin-left: 20px;
    margin-top: 42px;
  }
}

</style>
