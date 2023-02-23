import _ from 'lodash'

export default {
  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    emptyValue: {
      required: false,
      default: null
    }
  },
  computed: {
    clearActionVisible () {
      return this.clearable && !_.isNil(this.value)
    }
  },
  methods: {
    onClearClick () {
      this.$emit('input', this.emptyValue)
    }
  }
}
