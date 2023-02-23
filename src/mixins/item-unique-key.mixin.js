export default {
  data: function () {
    return {
      itemKeys: new WeakMap(),
      currentItemKey: 0
    }
  },
  methods: {
    getItemKey (item) {
      // Returns a unique key for each row. Required for drag - sort
      if (!this.itemKeys.has(item)) {
        this.itemKeys.set(item, ++this.currentItemKey)
      }

      return this.itemKeys.get(item)
    }
  }
}
