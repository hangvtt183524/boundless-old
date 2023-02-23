<template lang="pug">
  base-modal.discard-confirm-modal(
    :show='show'
    @close='close'
    max-width='640px'
  )
    template(v-slot:header)
      .discard-confirm-modal--header
        v-layout
          v-flex(xs12)
            .discard-confirm-modal--title {{ titleValue }}

    template(v-slot:default)
      .discard-confirm-modal--content
        v-layout
          v-flex(xs12)
            div
              span(v-html="textValue")

    template(v-slot:footer)
      .discard-confirm-modal--footer
        v-layout
          v-flex(xs12)
            base-button.base-button--danger.base-button--large(
              @click="onDiscardClick"
            ) {{ $t("general.discardChanges") }}
            base-button.base-button--green.base-button--large(
              v-if="!hideSaveAndExit"
              @click="onSaveAndContinueClick"
            ) {{ $t("general.saveAndExit") }}
            base-button.base-button--green--negative.base-button--large(
              @click="onBackClick"
            ) {{ $t("general.continueEditing") }}

</template>

<script>
import BaseButton from '../base-button/base-button.vue'
import BaseModal from '../base-modal/base-modal.vue'

export default {
  name: 'confirm-modal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    hideSaveAndExit: {
      type: Boolean,
      required: false
    }
  },
  data: function () {
    return {
      resolve: null,
      reject: null,
      title: null,
      text: null,
      show: false,
      choices: {
        discard: 'discard',
        saveAndExit: 'saveAndExit',
        back: 'back'
      }
    }
  },
  computed: {
    titleValue () {
      return this.title ? this.title : this.$t('general.discardConfirmTitle')
    },
    textValue () {
      return this.text ? this.text : this.$t('general.discardConfirmText')
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
    onDiscardClick () {
      this.resolve(this.choices.discard)
      this.show = false
    },
    onSaveAndContinueClick () {
      this.resolve(this.choices.saveAndExit)
      this.show = false
    },
    onBackClick () {
      this.close()
    },
    close () {
      this.resolve(this.choices.back)
      this.show = false
    }
  }
}
</script>

<style src="./discard-confirm-modal.scss" lang="scss" scoped></style>
