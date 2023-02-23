<template lang="pug">
  div(:data-test="dataTest")
    .title(v-if="title || slotTitle")
      v-layout(row)
        v-flex.py-3(xs12)
          slot(name="title")
            h3.small-heading {{ title }}
    .editable-panel
      v-layout(row wrap :class="{ disabled: disabled, readonly: disabled }")
        v-card.editable-card(:class="cardClass" data-test="editable-card" :readonly="!isEditing")
          div(
            @mouseleave="isHovering = false"
            @mouseover="isHovering = true"
          )
            v-toolbar.px-2.py-0(
              color="transparent"
              flat
            )
              v-spacer
              v-fade-transition
                v-btn(
                  data-test="edit-button"
                  @click="edit"
                  icon
                  small
                  v-show="showEditIcon"
                )
                  v-icon edit
            v-card-text.px-4.pt-0.pb-4
              slot(:readonly="!isEditing")
          v-fade-transition
            v-card-actions.px-4.pb-5.pt-0(
              color="white"
              v-show="isEditing || isLoading"
            )
              slot(name="actions")
                v-spacer
                v-btn(
                  data-test="btn-cancel"
                  @click="cancel"
                  color="success"
                  outline
                  round
                ) Cancel
                v-btn(
                  data-test="btn-submit"
                  :disabled="disableSubmit"
                  :loading="isLoading"
                  @click="submit"
                  color="success"
                  round
                ) {{ submitText }}

</template>

<script>
export default {
  name: 'EditablePanel',
  props: {
    disableSubmit: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: 'Save'
    },
    title: {
      type: String,
      default: ''
    },
    slotTitle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    dataTest: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      isHovering: false
    }
  },

  computed: {
    showEditIcon () {
      if (this.isReadonly) {
        return false
      }
      return !this.isEditing && this.isHovering
    },
    cardClass () {
      return {
        readonly: !this.isEditing,
        round: this.round,
        'elevation-10': this.isEditing,
        'showing-edit-icon': this.showEditIcon
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    edit () {
      this.$emit('edit')
    },
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'styles/components/panel.scss';
</style>
