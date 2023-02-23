<template lang="pug">
    base-dialog(:show="show", max-width='700px', @close="$emit('close')")
      h2.dialog-heading.mb-3 {{ dialogHeading }}
      .text-xs-left.mt-5
        v-text-field(
          :label="$t('splash.splashPageName')"
          @input="onInput"
          @change="onInput"
          :value="tempSplashPageName"
          :counter=50
          :rules="[rules.characterLimit]"
          required
        )
      .text-xs-right.mt-5
        v-btn(color='success' @click="$emit('close')" round large outline) {{ $t('general.cancel') }}
        v-btn(color='success' @click="duplicate" round large ) {{ $t('general.duplicate') }}
</template>

<script>
export default {
  name: 'CloneConfirmDialog',
  props: ['show', 'name'],
  computed: {
    dialogHeading () {
      if (this.name) {
        let cloneMessage = `Clone "${this.name}"`
        return cloneMessage
      }

      return 'Clone Splash Page'
    },
    tempSplashPageName () {
      if (this.name) {
        const nameSuffix = ' (Copy)'
        let cloneName = `${this.name}${nameSuffix}`

        // If clone name exceeds character length limit, trim name to fit limits
        if (cloneName.length > this.nameCharacterLimit) {
          const nameSectionLimit = this.nameCharacterLimit - nameSuffix.length
          cloneName = `${this.name.substring(0, nameSectionLimit)}${nameSuffix}`
        }

        return cloneName
      }

      return 'ClonedSplashPage'
    }
  },
  data () {
    return {
      splashPageName: '',
      nameCharacterLimit: 50,
      rules: {
        characterLimit (value) {
          return value.length <= 50 ? true : 'Splash Page Name Length limited'
        }
      }

    }
  },
  methods: {
    onInput (inputValue) {
      this.splashPageName = inputValue
    },
    duplicate () {
      const name = this.splashPageName === '' ? this.tempSplashPageName : this.splashPageName
      if (name.length <= 50) {
        this.$emit('confirmed', name)
      }
    }
  }
}
</script>
