<template lang="pug">
  div.device-resolution
    input(
      type="text",
      class="form-control",
      autocomplete="disabled",
      v-model="deviceResolution.width"
      @keyup="onChange"
    )
    span x
    input(
      type="text",
      class="form-control",
      autocomplete="disabled",
      v-model="deviceResolution.height"
      @keyup="onChange"
    )
</template>

<script>
export default {
  props: ['deviceResolution'],
  data () {
    return {
    }
  },
  methods: {
    onChange () {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
    .device-resolution {
        margin-left: 20px;
        display: flex;
        align-items: center;
        input {
            width: 50px;
            background: white;
            outline: none;
            text-align: center;
        }
    }
</style>
