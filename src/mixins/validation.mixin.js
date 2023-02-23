// const global.touchMap = new WeakMap()

export default {
  methods: {
    delayTouch ($v, timeout = 1000) {
      $v.$reset()
      if (global.touchMap.has($v)) {
        clearTimeout(global.touchMap.get($v))
      }
      global.touchMap.set($v, setTimeout($v.$touch, timeout))
    }
  }
}
