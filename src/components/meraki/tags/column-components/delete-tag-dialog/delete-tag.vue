<template lang='pug'>
  base-dialog(
    :persistent="true"
    :show="show"
    @close="close"
    max-width="536"
    scrollable
  )
    h2 {{ $t('tags.deleteTag') }}
    .delete-tag-description
      div {{ $t('tags.deleteTagDesc1') }}
      div {{ $t('tags.deleteTagDesc2') }}
    v-layout(row wrap pt-3)
      v-flex(xs8)
        base-button(
          class="submit-button base-button--green"
          @click="submit"
        ) {{ $t('general.delete') }}
        base-button(
          class="cancel-button base-button--green--negative"
          @click="close"
        ) {{ $t('general.cancel') }}
</template>

<script>
import BaseButton from '../../../../v2/base-button/base-button'

export default {
  props: ['show'],
  components: {
    BaseButton
  },
  data () {
    return {}
  },
  methods: {
    close () {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$emit('close')
    },
    submit () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
  h2 {
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;

    color: #223D70;
  }
  .delete-tag-description {
    margin-top: 15px;
    font-size: 16px;
    line-height: 22px;
  }
  .submit-button {
    margin-right: 24px;
  }
</style>
