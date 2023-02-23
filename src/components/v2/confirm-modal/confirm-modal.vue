<template>
  <base-modal
    class="confirm-modal"
    :show="show"
    @close="close"
    max-width="540px">
    <template v-slot:header>
      <div class="confirm-modal--header">
        <v-layout>
          <v-flex xs12>
            <div class="confirm-modal--title">{{ title }}</div>
          </v-flex>
        </v-layout>
      </div>
    </template>
    <template v-slot:default>
      <div class="confirm-modal--content">
        <v-layout>
          <v-flex xs12>
            <div>
              <span v-html="text"></span>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </template>
    <template v-slot:footer>
      <div class="confirm-modal--footer">
        <v-layout>
          <v-flex xs12>
            <base-button
              class="base-button--green base-button--large confirm-button"
              @click=onConfirmClick>{{ $t('general.continue') }}</base-button>
            <base-button
              class="base-button--green--negative base-button--large cancel-button"
              @click="onCancelClick">{{ $t('general.cancel') }}</base-button>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseButton from '../base-button/base-button.vue'
import BaseModal from '../base-modal/base-modal.vue'
export default {
  name: 'confirm-modal',
  components: { BaseModal, BaseButton },
  data: function () {
    return {
      resolve: null,
      reject: null,
      title: null,
      text: null,
      show: false
    }
  },
  methods: {
    open (title, text) {
      this.title = title
      this.text = text
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onConfirmClick () {
      this.resolve(true)
      this.show = false
    },
    onCancelClick () {
      this.resolve(false)
      this.show = false
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style src="./confirm-modal.scss" lang="scss" scoped></style>
