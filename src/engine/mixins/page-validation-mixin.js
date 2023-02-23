import { clone } from 'lodash'

let ValidationMixin = {
  data () {
    return {
      isValid: false,
      validFields: []
    }
  },
  computed: {
    requiredFields () {
      return this.pageConfig.pages[this.pageKey].children.filter((c) => {
        return c.config.fieldRequired === true
      }).map((c) => {
        return c.id
      })
    }
  },
  watch: {
    'validFields' (val) {
      // try {
      let arr1 = clone(val)
      let arr2 = clone(this.requiredFields)

      if (this.arrayContainsAll(arr2, arr1)) {
        this.isValid = true
      } else {
        this.isValid = false
      }
      // } catch (err) {
      //   console.error(err)
      // }
    }
  },
  methods: {
    validateInput (val) {
      // try {
      let index = this.validFields.findIndex(c => c === val.index)

      if (!val.valid && index > -1) {
        this.validFields.splice(index, 1)
      } else if (val.valid && this.validFields.indexOf(val.index) < 0) {
        this.validFields.push(val.index)
      }
      // } catch (err) {
      //   console.error(err)
      // }
    },
    // Check if first array contains all elements of second
    arrayContainsAll (first, second) {
      return first.every(function (val) { return second.indexOf(val) >= 0 })
    }
  }
}

export default ValidationMixin
